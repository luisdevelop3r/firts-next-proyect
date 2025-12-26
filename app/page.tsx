import EventCard from '@/components/EventCard'
import ExploreBtn from '@/components/ExploreBtn'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const Page = async () => {
  const response = await fetch(`${BASE_URL}/api/events`);
  const { events } = await response.json();
  
  return (
    <section>
      <h1 className="text-center">The Hub for Every Dev Event <br /> You Can't Miss</h1>
      <p className="text-center mt-5">Hackathons, Meetups, Conferences, All in One Place</p>
      <ExploreBtn />

      <div>
        <h3 className='mt-20 space-y-7'>Featured Events</h3>
        <ul className="events">
          {events && events.length > 0 && events.map((event: Event) => (
            <li key={event.title} className='list-none cursor-pointer'>
              <EventCard {...event} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default Page