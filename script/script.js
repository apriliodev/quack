document.getElementById('dropDuck').addEventListener('click', dropDuck);
document.getElementById('clearDucks').addEventListener('click', clearDucks);

let normalDuckCount = 0;
let redDuckCount = 0;
let blueDuckCount = 0;
let purpleDuckCount = 0;

// Initialiser Matter.js
const { Engine, Render, Runner, Bodies, Composite, Body, Events } = Matter;

const engine = Engine.create();


const world = engine.world;

const duckTypes = [
    { type: 'normal', texture: '../img/duck.png', probability: 60 },
    { type: 'red', texture: '../img/red_duck.png', probability: 20 },
    { type: 'blue', texture: '../img/blue_duck.png', probability: 17 },
    { type: 'purple', texture: '../img/purple_duck.png', probability: 13},
];


const render = Render.create({
    element: document.getElementById('duckContainer'),
    engine: engine,
    options: {
        width: window.innerWidth,
        height: window.innerHeight,
        wireframes: false,
        background: 'transparent'
    }
});

Render.run(render);
Runner.run(Runner.create(), engine);

// Ajouter des murs pour contenir les canards
const ground = Bodies.rectangle(window.innerWidth / 2, window.innerHeight, window.innerWidth, 50, { isStatic: true });
const leftWall = Bodies.rectangle(0, window.innerHeight / 2, 50, window.innerHeight, { isStatic: true });
const rightWall = Bodies.rectangle(window.innerWidth, window.innerHeight / 2, 50, window.innerHeight, { isStatic: true });

Composite.add(world, [ground, leftWall, rightWall]);
ground.restitution = 2; // Ajustez la valeur selon vos besoins

// Ajouter un gestionnaire d'événements pour détecter les collisions entre les canards et le sol
Events.on(engine, 'collisionStart', event => {
    const pairs = event.pairs;
    pairs.forEach(pair => {
        const { bodyA, bodyB } = pair;
        if (bodyA === ground || bodyB === ground) {
            const duckBody = bodyA === ground ? bodyB : bodyA;
            const velocityY = duckBody.velocity.y;
            if (velocityY > 5) { // Vérifiez si la vitesse verticale est suffisamment grande pour simuler un rebondissement
                Body.setVelocity(duckBody, { x: duckBody.velocity.x, y: -velocityY * 0.5 }); // Inversez la direction et réduisez la vitesse
            }
        }        
    });
});     
function getRandomDuckType() {
    const random = Math.random() * 100;
    let sum = 0;

    for (let i = 0; i < duckTypes.length; i++) {
        sum += duckTypes[i].probability;
        if (random <= sum) {
            return duckTypes[i];
        }
    }
    return duckTypes[duckTypes.length - 1]; 
}

function dropDuck() {
    const duckType = getRandomDuckType();
    
    // Mettre à jour les compteurs en fonction du type de canard
    switch (duckType.type) {
        case 'normal':
            normalDuckCount++;
            document.getElementById('normalDuckCount').innerText = normalDuckCount;
            break;
        case 'red':
            redDuckCount++;
            document.getElementById('redDuckCount').innerText = redDuckCount;
            break;
        case 'blue':
            blueDuckCount++;
            document.getElementById('blueDuckCount').innerText = blueDuckCount;
            break;
        case 'purple':
            purpleDuckCount++;
            document.getElementById('purpleDuckCount').innerText = purpleDuckCount;
            break;    
    }

    const duck = Bodies.rectangle(Math.random() * (window.innerWidth - 30), -30, 30, 30, {
        restitution: 0.5,
        render: {
            sprite: {
                texture: duckType.texture,
                xScale: 30 / 100,
                yScale: 30 / 100
            }
        }
    });
    Composite.add(world, duck);
}


  // Check if it's a purple duck and start page spin animation
  if (randomDuck === 'purple') {
    document.body.classList.add('spin-animation');

    setTimeout(() => {
      window.location.href = 'https://youtube.com/'; // Replace with your desired URL
    }, 10000); // 10 seconds for 10 spins
  }

function clearDucks() {
    const allBodies = Composite.allBodies(world);
    for (const body of allBodies) {
        if (body !== ground && body !== leftWall && body !== rightWall) {
            Composite.remove(world, body);
        }
    }
}

// Mettre à jour le rendu et redimensionner les murs en cas de redimensionnement de la fenêtre
window.addEventListener('resize', () => {
    Render.lookAt(render, {
        min: { x: 0, y: 0 },
        max: { x: window.innerWidth, y: window.innerHeight }
    });

    Body.setPosition(ground, { x: window.innerWidth / 1, y: window.innerHeight });
    //Body.setPosition(leftWall, { x: 0, y: window.innerHeight / 0 });
    //Body.setPosition(rightWall, { x: window.innerWidth, y: window.innerHeight / 0 });

    Body.setVertices(ground, Matter.Vertices.fromPath(`0 0 ${window.innerWidth} 0 ${window.innerWidth} 50 0 50`));
    //Body.setVertices(leftWall, Matter.Vertices.fromPath(`0 0 50 0 50 ${window.innerHeight} 0 ${window.innerHeight}`));
    //Body.setVertices(rightWall, Matter.Vertices.fromPath(`0 0 50 0 50 ${window.innerHeight} 0 ${window.innerHeight}`));
});
