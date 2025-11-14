import EventCard from '@/components/EventCard'
import ExploreBtn from '@/components/ExploreBtn'
import { events } from '@/lib/constants'



const Page = () => {
  return (
    <section>
      <h1 className="text-center">The Hub for Every Dev Event <br /> You Can't Miss</h1>
      <p className="text-center mt-5">Hackathons, Meetups, Conferences, All in One Place</p>
      <ExploreBtn />

      <div>
        <h3 className='mt-20 space-y-7'>Featured Events</h3>
        <ul className="events">
          {events.map((event) => (
            <li key={event.title} className='list-none'>
              <EventCard {...event} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default Page