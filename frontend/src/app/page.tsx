import TicketForm from '@/components/TicketForm'

export default function HomePage() {
  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-2xl font-bold text-slate-900'>Покупка билетов</h2>
        <p className='mt-1 text-sm text-slate-600'>
          Взрослый билет — 18+, детский — младше 18. Ребёнок не может быть без
          взрослого. На одного взрослого — не более 3 детей.
        </p>
      </div>
      <TicketForm />
    </div>
  )
}
