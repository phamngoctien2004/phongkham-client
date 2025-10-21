import { SectionTitle, DoctorCard } from './ui';
import doctor1 from '../assets/images/doctors/doctors-1.jpg';
import doctor2 from '../assets/images/doctors/doctors-2.jpg';
import doctor3 from '../assets/images/doctors/doctors-3.jpg';
import doctor4 from '../assets/images/doctors/doctors-4.jpg';

const Doctors = () => {
  const doctors = [
    {
      image: doctor1,
      name: 'Walter White',
      position: 'Chief Medical Officer',
      description: 'Explicabo voluptatem mollitia et repellat qui dolorum quasi',
      delay: '100',
    },
    {
      image: doctor2,
      name: 'Sarah Jhonson',
      position: 'Anesthesiologist',
      description: 'Aut maiores voluptates amet et quis praesentium qui senda para',
      delay: '200',
    },
    {
      image: doctor3,
      name: 'William Anderson',
      position: 'Cardiology',
      description: 'Quisquam facilis cum velit laborum corrupti fuga rerum quia',
      delay: '300',
    },
    {
      image: doctor4,
      name: 'Amanda Jepson',
      position: 'Neurosurgeon',
      description: 'Dolorum tempora officiis odit laborum officiis et et accusamus',
      delay: '400',
    },
  ];

  return (
    <section id="doctors" className="doctors section">
      <div className="container">
        <SectionTitle
          title="Doctors"
          subtitle=""
        />
      </div>

      <div className="container">
        <div className="row gy-4">
          {doctors.map((doctor, index) => (
            <DoctorCard
              key={index}
              image={doctor.image}
              name={doctor.name}
              position={doctor.position}
              description={doctor.description}
              aosDelay={doctor.delay}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Doctors;
