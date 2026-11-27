/* Placeholder sample content — to be replaced with the real GAMEMOB MOOC material. */
const COURSE = {
  title: "Play, Learn, Move Sustainably",
  overview: {
    id: "intro",
    title: "About this course",
    body: `
      <p>How we move around our towns affects our safety, our health, the air we breathe and the climate. In this free, self-paced course you will look at the streets and journeys you know, test ideas in interactive activities and propose ways to make them better.</p>

      <h2>Who it is for</h2>
      <p>Students aged 12–19, studying on their own or in class. No previous knowledge is needed. Teachers will find a guide in every module.</p>

      <h2>What you will learn</h2>
      <p>By the end of the course you will be able to:</p>
      <h3>1. Sustainable Mobility Basics</h3>
      <ul>
        <li>Name the three pillars of sustainable mobility and give an example of each</li>
        <li>Compare how many people a car lane, a bus lane and a bike lane can carry</li>
        <li>Propose a street design and explain who gains and who gives something up</li>
      </ul>
      <h3>2. Traffic Safety</h3>
      <ul>
        <li>Explain the difference between reaction distance and braking distance</li>
        <li>Estimate how far a car needs to stop, and why speed matters so much</li>
        <li>Name measures that reduce risk near a school</li>
      </ul>
      <h3>3. Environmental Impacts</h3>
      <ul>
        <li>Calculate the CO₂ emissions of a journey</li>
        <li>Identify which trips cause most of a class's emissions</li>
        <li>Describe school-level measures that cut emissions and traffic</li>
      </ul>
      <h3>4. Active Mobility</h3>
      <ul>
        <li>Define active mobility and name its benefits</li>
        <li>Compare travel modes door to door</li>
        <li>Rate a real cycling route against five requirements</li>
      </ul>
      <h3>5. Innovation</h3>
      <ul>
        <li>Compare ways of controlling a pedestrian crossing, and their trade-offs</li>
        <li>Ask critical questions about smart systems, such as privacy, failure and access</li>
        <li>Plan a small pilot that tackles a local mobility problem</li>
      </ul>

      <h2>How each module works</h2>
      <ul>
        <li><strong>Lessons:</strong> short introductions to the topic</li>
        <li><strong>Interactive:</strong> a simulation where you try out decisions and see what happens</li>
        <li><strong>Study page:</strong> a short reading with key figures and a glossary</li>
        <li><strong>Worksheet:</strong> a printable activity for your school or neighbourhood</li>
        <li><strong>Quiz:</strong> six questions with an explanation after each answer</li>
        <li><strong>Teacher guide:</strong> lesson plan and answers, for teachers</li>
      </ul>

      <h2>Good to know</h2>
      <ul>
        <li>The course has five modules and takes about 10–12 hours</li>
        <li>You can stop at any time. Your progress is saved on this device</li>
        <li>No sign-up is needed</li>
      </ul>
    `
  },
  modules: [
    {
      id: "m1",
      title: "Sustainable Mobility Basics",
      lessons: [
        {
          id: "m1l1",
          title: "What Is Sustainable Mobility?",
          body: `
            <p>Sustainable mobility means moving people and goods in ways that meet today's needs without compromising the environment, safety, or quality of life for future generations.</p>
            <p>In this lesson you'll explore the three pillars of sustainable transport (environmental, social and economic) and see why cities across Europe are rethinking how streets are designed.</p>
            <ul>
              <li>Why "more roads" doesn't solve congestion</li>
              <li>The transport hierarchy: walking, cycling, public transport, shared mobility, private cars</li>
              <li>How mobility choices connect to climate goals</li>
            </ul>
          `
        },
        {
          id: "m1l2",
          title: "Why Cities Need to Change How We Move",
          body: `
            <p>Urban areas are growing fast, and traffic, noise, and air pollution are growing with them. This lesson looks at real examples from RIS regions in Greece and Serbia.</p>
            <p>You'll learn how small daily choices, like walking to school instead of being driven, add up to measurable change at the city level.</p>
          `
        }
      ],
      material: {
        id: "m1p",
        title: "How a street shares its space",
        src: "scorm/m1/material.html"
      },
      activity: {
        id: "m1a",
        title: "Rebuild the street",
        src: "scorm/m1/index.html",
        zip: "scorm/downloads/gamemob-m1-rebuild-the-street.zip",
        intro: "Redesign a 20 m street for a school, and see how many people each choice can move."
      },
      worksheet: {
        id: "m1w",
        title: "Street audit",
        src: "materials/m1-worksheet.html"
      },
      teacher: {
        id: "m1t",
        title: "Teacher guide: How a street shares its space",
        src: "materials/m1-teacher.html"
      },
      quiz: {
        id: "m1q",
        title: "Module 1 Check",
        questions: [
          {
            q: "Which of these is NOT one of the three pillars of sustainable mobility?",
            options: ["Environmental", "Social", "Entertainment", "Economic"],
            correct: 2,
            explain: "The pillars are environmental, social and economic."
          },
          {
            q: "In the transport hierarchy, which mode is generally prioritized first?",
            options: ["Private cars", "Walking", "Air travel", "Freight trucks"],
            correct: 1,
            explain: "Walking uses the least space and causes the least harm, so it comes first. The private car comes last."
          },
          {
            q: "Compared with a general car lane, how many people can a bus lane carry per hour?",
            options: ["Fewer people", "About the same", "Several times more", "Exactly 100 more"],
            correct: 2,
            explain: "Street design guides give roughly 600 to 1,600 people an hour for a car lane and 4,000 to 8,000 for a bus lane."
          },
          {
            q: "What is induced demand?",
            options: ["Traffic that disappears when roads are widened", "Extra traffic that appears because road capacity was added", "A tax on car use", "Demand for bus tickets"],
            correct: 1,
            explain: "More road space makes driving more attractive, so traffic grows to fill it. That is why widening roads rarely cures congestion."
          },
          {
            q: "Which design gives a bike lane real protection?",
            options: ["A painted line next to moving traffic", "Parked cars, a kerb or planters between the lane and traffic", "A sign saying cyclists have priority", "A wider car lane"],
            correct: 1,
            explain: "Physical separation is what makes a lane usable for children and less confident riders. Paint alone is not protection."
          },
          {
            q: "Sustainable mobility is mainly about\u2026",
            options: ["making cars faster", "giving people access to where they need to go while limiting harm", "banning all private vehicles", "building more roads"],
            correct: 1,
            explain: "People want access, not travel for its own sake. The aim is to provide it with less pollution, danger and land take."
          }
        ]
      }
    },
    {
      id: "m2",
      title: "Traffic Safety",
      lessons: [
        {
          id: "m2l1",
          title: "Understanding Road Risks",
          body: `
            <p>Road traffic injuries remain one of the leading causes of harm to young people. This lesson breaks down the most common risk factors near schools and residential streets.</p>
            <ul>
              <li>Speed and stopping distance</li>
              <li>Visibility and blind spots</li>
              <li>Distraction, for drivers and pedestrians alike</li>
            </ul>
          `
        },
        {
          id: "m2l2",
          title: "Safe Behavior for Pedestrians & Cyclists",
          body: `
            <p>Practical habits that reduce risk: crossing at marked points, making eye contact with drivers, using lights and reflective gear when cycling at dusk, and choosing safer routes.</p>
          `
        }
      ],
      material: {
        id: "m2p",
        title: "Why speed decides who walks away",
        src: "scorm/m2/material.html"
      },
      activity: {
        id: "m2a",
        title: "Will it stop in time?",
        src: "scorm/m2/index.html",
        zip: "scorm/downloads/gamemob-m2-stopping-distance.zip",
        intro: "Find the highest speed at which a car still stops short of a child in three situations."
      },
      worksheet: {
        id: "m2w",
        title: "Speed check and crossing audit",
        src: "materials/m2-worksheet.html"
      },
      teacher: {
        id: "m2t",
        title: "Teacher guide: Why speed decides who walks away",
        src: "materials/m2-teacher.html"
      },
      quiz: {
        id: "m2q",
        title: "Module 2 Check",
        questions: [
          {
            q: "What is the safest place to cross a street?",
            options: ["Anywhere with a gap in traffic", "A marked crossing", "Behind a parked bus", "Mid-block, running"],
            correct: 1,
            explain: "A marked crossing tells drivers where to expect people and gives you a place where you can see and be seen."
          },
          {
            q: "During the driver's reaction time, the car\u2026",
            options: ["has already started slowing down", "keeps travelling at full speed", "stops immediately", "speeds up"],
            correct: 1,
            explain: "Braking only starts after the driver has noticed, decided and moved a foot. In that time the car covers speed times reaction time."
          },
          {
            q: "Going from 30 to 50 km/h, the braking distance\u2026",
            options: ["grows by 67%", "almost triples", "stays the same", "exactly doubles"],
            correct: 1,
            explain: "Braking distance grows with the square of the speed: (50 divided by 30) squared is about 2.8."
          },
          {
            q: "At the same speed, compared with a dry road, the braking distance on a wet road is\u2026",
            options: ["shorter", "the same", "longer", "impossible to say"],
            correct: 2,
            explain: "Friction is lower on a wet road (about 0.4 against 0.7), so the car needs about 1.75 times as far to stop."
          },
          {
            q: "A child steps out 14 m ahead of an alert driver on a dry road. What happens?",
            options: ["Both 30 and 50 km/h cars stop in time", "At 30 km/h the car stops in time; at 50 km/h it reaches the child at almost full speed", "At 50 km/h the car stops first", "The speed does not matter"],
            correct: 1,
            explain: "At 30 km/h the total stopping distance is about 13.4 m. At 50 km/h the reaction distance alone is about 13.9 m, so the brakes barely start before the child."
          },
          {
            q: "The Safe System approach starts from the idea that\u2026",
            options: ["people never make mistakes", "people make mistakes, so the system must make sure mistakes do not kill", "only drivers are responsible", "speed does not matter"],
            correct: 1,
            explain: "It accepts human error and designs roads, speeds and vehicles so that a mistake does not become a death."
          }
        ]
      }
    },
    {
      id: "m3",
      title: "Environmental Impacts",
      lessons: [
        {
          id: "m3l1",
          title: "Transport & Climate Change",
          body: `
            <p>Transport is one of the largest sources of greenhouse gas emissions in the EU. This lesson connects everyday travel choices to the bigger climate picture.</p>
          `
        },
        {
          id: "m3l2",
          title: "Air Quality and Urban Life",
          body: `
            <p>Beyond climate, vehicle emissions affect the air we breathe every day. You'll see how traffic patterns near schools influence local air quality and health.</p>
          `
        }
      ],
      material: {
        id: "m3p",
        title: "Reading the emissions of a journey",
        src: "scorm/m3/material.html"
      },
      activity: {
        id: "m3a",
        title: "The school run, in grams",
        src: "scorm/m3/index.html",
        zip: "scorm/downloads/gamemob-m3-school-run-co2.zip",
        intro: "Change how 24 pupils get to school and watch the class's yearly emissions respond."
      },
      worksheet: {
        id: "m3w",
        title: "Class commute survey",
        src: "materials/m3-worksheet.html"
      },
      teacher: {
        id: "m3t",
        title: "Teacher guide: Reading the emissions of a journey",
        src: "materials/m3-teacher.html"
      },
      quiz: {
        id: "m3q",
        title: "Module 3 Check",
        questions: [
          {
            q: "Which sector is among the largest sources of CO2 emissions in the EU?",
            options: ["Agriculture", "Transport", "Textile manufacturing", "Publishing"],
            correct: 1,
            explain: "Transport produces roughly a quarter of the EU's greenhouse gas emissions, and road transport is most of that."
          },
          {
            q: "Why does a car with three pupils emit less per pupil than a car with one?",
            options: ["The engine is smaller", "The same emissions are shared among more people", "Heavier cars are cleaner", "It drives a shorter way"],
            correct: 1,
            explain: "Emissions per passenger-kilometre fall as occupancy rises, because the car's emissions are divided among more people."
          },
          {
            q: "In the class of the activity, which pupils cause the largest share of emissions?",
            options: ["Those living under 1 km away", "Those living 1 to 3 km away", "Those living over 3 km away", "All groups cause the same"],
            correct: 2,
            explain: "Pupils over 3 km are a quarter of the class but cause about 55% of the emissions, because distance multiplies the factor."
          },
          {
            q: "Which of these is NOT included in the activity's emissions figures?",
            options: ["The distance of the trip", "The mode of transport", "Emissions from making the vehicles", "The number of school days"],
            correct: 2,
            explain: "Only operating emissions on the journey to school are counted. Manufacturing and building roads are left out."
          },
          {
            q: "Why are idling cars at the school gate a health concern?",
            options: ["They are noisy only", "They create a concentrated peak of exhaust exactly when children arrive", "Idling is illegal everywhere", "They use more petrol than driving"],
            correct: 1,
            explain: "Exhaust contains nitrogen dioxide and fine particles, and children's lungs are still developing."
          },
          {
            q: "The WHO 2021 annual guideline for fine particles (PM2.5) is\u2026",
            options: ["5 micrograms per cubic metre", "25 micrograms per cubic metre", "50 micrograms per cubic metre", "100 micrograms per cubic metre"],
            correct: 0,
            explain: "WHO tightened the guideline to 5 micrograms per cubic metre in 2021. Many European cities are above it."
          }
        ]
      }
    },
    {
      id: "m4",
      title: "Active Mobility",
      lessons: [
        {
          id: "m4l1",
          title: "Walking & Cycling as Everyday Transport",
          body: `
            <p>Active mobility isn't just exercise. It's a practical way to get around that also improves concentration, mood, and independence for students.</p>
          `
        },
        {
          id: "m4l2",
          title: "Micromobility: Bikes, Scooters, and More",
          body: `
            <p>An overview of the growing range of active and shared mobility options, and the infrastructure (bike lanes, parking, shared schemes) that makes them safe and viable.</p>
          `
        }
      ],
      material: {
        id: "m4p",
        title: "Why short trips belong to people",
        src: "scorm/m4/material.html"
      },
      activity: {
        id: "m4a",
        title: "Door to door",
        src: "scorm/m4/index.html",
        zip: "scorm/downloads/gamemob-m4-door-to-door.zip",
        intro: "Guess when the car overtakes the bike, then test your guess against a door-to-door model."
      },
      worksheet: {
        id: "m4w",
        title: "My door to door",
        src: "materials/m4-worksheet.html"
      },
      teacher: {
        id: "m4t",
        title: "Teacher guide: Why short trips belong to people",
        src: "materials/m4-teacher.html"
      },
      quiz: {
        id: "m4q",
        title: "Module 4 Check",
        questions: [
          {
            q: "Which of these is an example of active mobility?",
            options: ["Driving a car", "Cycling to school", "Taking a flight", "Riding in a taxi"],
            correct: 1,
            explain: "Active mobility is travel powered mainly by the traveller: walking, cycling, scooting and wheeling."
          },
          {
            q: "Door-to-door time includes\u2026",
            options: ["only the time the vehicle moves", "walking to the stop, waiting, parking and walking at the end", "only waiting time", "only the time on the bus"],
            correct: 1,
            explain: "Every mode has minutes that are not moving, and they can be as long as the moving part on a short trip."
          },
          {
            q: "In the activity, the car overtakes the bike at about 4.5 km in the rush hour. On free-flowing roads the crossover is\u2026",
            options: ["longer (more than 4.5 km)", "about the same", "shorter (about 2.2 km)", "never"],
            correct: 2,
            explain: "On empty roads the car is faster, so it overtakes the bike earlier, at a shorter distance."
          },
          {
            q: "Which is NOT one of the five main requirements for a good cycling route (CROW)?",
            options: ["Directness", "Safety", "Low cost", "Comfort"],
            correct: 2,
            explain: "The five are cohesion, directness, safety, comfort and attractiveness."
          },
          {
            q: "How much activity does the WHO recommend for children and adolescents aged 5 to 17, on average?",
            options: ["15 minutes a day", "30 minutes a day", "60 minutes a day", "120 minutes a day"],
            correct: 2,
            explain: "WHO recommends an average of 60 minutes of moderate-to-vigorous activity a day. Walking or cycling to school can be part of it."
          },
          {
            q: "Why is a protected bike lane more effective than a painted line?",
            options: ["It is cheaper", "More people, including children, feel safe using it", "Cars drive faster beside it", "It has no junctions"],
            correct: 1,
            explain: "Most people say the road, not their own skill, puts them off cycling. Separation changes who is willing to ride."
          }
        ]
      }
    },
    {
      id: "m5",
      title: "Innovation",
      lessons: [
        {
          id: "m5l1",
          title: "Smart Mobility Technologies",
          body: `
            <p>From real-time transit apps to sensor-based traffic management, technology is reshaping how cities move. This lesson introduces the innovations behind "smart mobility."</p>
          `
        },
        {
          id: "m5l2",
          title: "Designing the Mobility of Tomorrow",
          body: `
            <p>You'll wrap up the course by imagining and sketching your own idea for a more sustainable, safer way to move around your city, the same kind of thinking behind the GAMEMOB serious game.</p>
          `
        }
      ],
      material: {
        id: "m5p",
        title: "Technology as a tool, not the goal",
        src: "scorm/m5/material.html"
      },
      activity: {
        id: "m5a",
        title: "Teach the crossing to listen",
        src: "scorm/m5/index.html",
        zip: "scorm/downloads/gamemob-m5-smart-crossing.zip",
        intro: "Tune a fixed timer, a push button and a sensor at a school crossing and compare the results."
      },
      worksheet: {
        id: "m5w",
        title: "Human signal and pilot plan",
        src: "materials/m5-worksheet.html"
      },
      teacher: {
        id: "m5t",
        title: "Teacher guide: Technology as a tool, not the goal",
        src: "materials/m5-teacher.html"
      },
      quiz: {
        id: "m5q",
        title: "Module 5 Check",
        questions: [
          {
            q: "What is an example of a 'smart mobility' technology?",
            options: ["A paper bus timetable", "A real-time transit app", "A horse-drawn cart", "A printed map"],
            correct: 1,
            explain: "Smart mobility uses live data and digital tools to make transport work better."
          },
          {
            q: "A push-button crossing knows\u2026",
            options: ["how many people are waiting and if the road is empty", "that a pedestrian is waiting, but not how many or whether the road is empty", "nothing at all", "the exact speed of every car"],
            correct: 1,
            explain: "It only gets a request. A sensor can add information about who is waiting and about approaching traffic."
          },
          {
            q: "In the activity, what did the sensor controller do better than the others?",
            options: ["It made cars wait much longer", "It cut pedestrian waiting roughly in half without making cars wait much longer", "It removed the need for signals", "It was cheaper"],
            correct: 1,
            explain: "At the school peak it turned early when no cars were waiting, so pedestrians waited less. It also costs more and needs maintenance."
          },
          {
            q: "Why does a long pedestrian wait matter for safety?",
            options: ["It does not", "People may give up and cross on red", "It makes cars faster", "It saves electricity"],
            correct: 1,
            explain: "In the simulation, people who wait 35 seconds cross on red. A short wait is a safety feature, not only a convenience."
          },
          {
            q: "Which is a privacy-friendly way to detect pedestrians at a crossing?",
            options: ["Keeping face images forever", "Counting people without identifying them", "Recording phone numbers", "Publishing the video online"],
            correct: 1,
            explain: "Counting can be done without storing identifiable data. Under the GDPR, ask what is recorded and for how long."
          },
          {
            q: "According to the method in the study page, what is the first step in designing your own idea?",
            options: ["Buy a sensor", "Name one concrete problem and the people it affects", "Write an app", "Ask for money"],
            correct: 1,
            explain: "A specific problem lets you decide what to measure and what the simplest fix is."
          }
        ]
      }
    }
  ]
};
