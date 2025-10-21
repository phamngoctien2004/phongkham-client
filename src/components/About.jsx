import aboutImg from '../assets/images/about.jpg';

const About = () => {
  return (
    <section id="about" className="about section">
      <div className="container">
        <div className="row gy-4 gx-5">
          <div
            className="col-lg-6 position-relative align-self-start"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <img src={aboutImg} className="img-fluid" alt="" />
            <a
              href="https://www.youtube.com/watch?v=Y7f98aduVJ8"
              className="glightbox pulsating-play-btn"
            ></a>
          </div>

          <div className="col-lg-6 content" data-aos="fade-up" data-aos-delay="100">
            <h3>About Us</h3>
            <p>
              Dolor iure expedita id fuga asperiores qui sunt consequatur minima. Quidem voluptas
              deleniti. Sit quia molestiae quia quas qui magnam itaque veritatis dolores. Corrupti
              totam ut eius incidunt reiciendis veritatis asperiores placeat.
            </p>
            <ul>
              <li>
                <i className="fa-solid fa-vial-circle-check"></i>
                <div>
                  <h5>Ullamco laboris nisi ut aliquip consequat</h5>
                  <p>
                    Magni facilis facilis repellendus cum excepturi quaerat praesentium libre trade
                  </p>
                </div>
              </li>
              <li>
                <i className="fa-solid fa-pump-medical"></i>
                <div>
                  <h5>Magnam soluta odio exercitationem reprehenderi</h5>
                  <p>
                    Quo totam dolorum at pariatur aut distinctio dolorum laudantium illo direna
                    pasata redi
                  </p>
                </div>
              </li>
              <li>
                <i className="fa-solid fa-heart-circle-check"></i>
                <div>
                  <h5>Voluptatem et qui exercitationem</h5>
                  <p>
                    Et nemo dolorem perferendis laborum. Modi architecto numquam excepturi sint
                    dolorem maiores
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
