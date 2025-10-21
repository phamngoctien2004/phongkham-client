import { SectionTitle, ServiceCard } from './ui';

const Services = () => {
  const services = [
    {
      icon: 'fas fa-heartbeat',
      title: 'Nesciunt Mete',
      description:
        'Provident nihil minus qui consequatur non omnis maiores. Eos accusantium minus dolores iure perferendis tempore et consequatur.',
      delay: '100',
    },
    {
      icon: 'fas fa-pills',
      title: 'Eosle Commodi',
      description:
        'Ut autem aut autem non a. Sint sint sit facilis nam iusto sint. Libero corrupti neque eum hic non ut nesciunt dolorem.',
      delay: '200',
    },
    {
      icon: 'fas fa-hospital-user',
      title: 'Ledo Markt',
      description:
        'Ut excepturi voluptatem nisi sed. Quidem fuga consequatur. Minus ea aut. Vel qui id voluptas adipisci eos earum corrupti.',
      delay: '300',
    },
    {
      icon: 'fas fa-dna',
      title: 'Asperiores Commodit',
      description:
        'Non et temporibus minus omnis sed dolor esse consequatur. Cupiditate sed error ea fuga sit provident adipisci neque.',
      delay: '400',
    },
    {
      icon: 'fas fa-wheelchair',
      title: 'Velit Doloremque',
      description:
        'Cumque et suscipit saepe. Est maiores autem enim facilis ut aut ipsam corporis aut. Sed animi at autem alias eius labore.',
      delay: '500',
    },
    {
      icon: 'fas fa-notes-medical',
      title: 'Dolori Architecto',
      description:
        'Hic molestias ea quibusdam eos. Fugiat enim doloremque aut neque non et debitis iure. Corrupti recusandae ducimus enim.',
      delay: '600',
    },
  ];

  return (
    <section id="services" className="services section">
      <div className="container">
        <SectionTitle
          title="Services"
          subtitle="Necessitatibus eius consequatur ex aliquid fuga eum quidem sint consectetur velit"
        />
      </div>

      <div className="container">
        <div className="row gy-4">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              icon={service.icon}
              title={service.title}
              description={service.description}
              aosDelay={service.delay}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
