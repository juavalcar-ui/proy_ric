-- Perfiles públicos, uno por usuario de auth.users
create table if not exists profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  alias text,
  avatar_url text,
  message text,
  link_url text,
  is_anonymous boolean not null default false,
  total_paid numeric(12, 2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Historial de pagos; total_paid en profiles se recalcula vía trigger
create table if not exists transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  amount numeric(12, 2) not null check (amount > 0),
  currency text not null default 'eur',
  stripe_payment_intent_id text unique,
  status text not null default 'pending' check (status in ('pending', 'succeeded', 'failed')),
  created_at timestamptz not null default now()
);

create index if not exists transactions_user_id_idx on transactions (user_id);
create index if not exists profiles_total_paid_idx on profiles (total_paid desc);

-- Crea el perfil automáticamente cuando se registra un usuario
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into profiles (id) values (new.id);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- Solo transacciones que pasan a 'succeeded' suman al total (idempotente)
create or replace function handle_transaction_succeeded()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if new.status = 'succeeded' and old.status is distinct from 'succeeded' then
    update profiles
      set total_paid = total_paid + new.amount,
          updated_at = now()
      where id = new.user_id;
  end if;
  return new;
end;
$$;

drop trigger if exists on_transaction_succeeded on transactions;
create trigger on_transaction_succeeded
  after update on transactions
  for each row execute procedure handle_transaction_succeeded();

-- Vista pública: oculta datos identificativos cuando is_anonymous = true
create or replace view public_ranking as
select
  id,
  case when is_anonymous then 'Anónimo' else coalesce(alias, 'Sin alias') end as display_name,
  case when is_anonymous then null else avatar_url end as avatar_url,
  case when is_anonymous then null else message end as message,
  case when is_anonymous then null else link_url end as link_url,
  total_paid
from profiles
where total_paid > 0
order by total_paid desc;

-- RLS
alter table profiles enable row level security;
alter table transactions enable row level security;

create policy "profiles are publicly readable"
  on profiles for select
  using (true);

create policy "users can update own profile"
  on profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "users can read own transactions"
  on transactions for select
  using (auth.uid() = user_id);

-- Inserts/updates de transactions solo vía backend (service role), no desde el cliente
revoke insert, update on transactions from anon, authenticated;
