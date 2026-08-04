import { Link } from "react-router-dom";

const technologies = [
  {
    category: "Software Development",
    items: [
      "React",
      "Node.js",
      "Express.js",
      "Laravel",
      "Python",
      "Flutter",
      "Java",
      "C#"
    ]
  },
  {
    category: "Cloud & DevOps",
    items: [
      "AWS",
      "Azure",
      "Docker",
      "Kubernetes",
      "Nginx",
      "Linux"
    ]
  },
  {
    category: "Networking",
    items: [
      "Cisco",
      "MikroTik",
      "Ubiquiti",
      "Fortinet",
      "Huawei"
    ]
  },
  {
    category: "Embedded & IoT",
    items: [
      "Arduino",
      "ESP32",
      "STM32",
      "Raspberry Pi",
      "LoRa",
      "MQTT"
    ]
  }
];

export default function RelatedTechnologies() {
  return (
    <section className="container py-5">
      <h2 className="text-center mb-5">
        Technologies We Work With
      </h2>

      <div className="row">

        {technologies.map((group) => (

          <div className="col-lg-3 mb-4" key={group.category}>

            <div className="card h-100">

              <div className="card-body">

                <h5>{group.category}</h5>

                <ul className="list-unstyled">

                  {group.items.map((item) => (

                    <li key={item}>
                      <Link
                        to={`/technologies/${item.toLowerCase()}`}
                      >
                        {item}
                      </Link>
                    </li>

                  ))}

                </ul>

              </div>

            </div>

          </div>

        ))}

      </div>

    </section>
  );
}