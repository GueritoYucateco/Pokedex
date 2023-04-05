const log = console.log;

const typeColors = {
    grass: 'green',
    fire: 'red',
    water: 'blue',
    bug: 'rgb(134, 196, 42)',
    poison: 'rgb(65, 1, 65)',
    electric: 'rgba(205, 173, 0)',
    ground: '#997917',
    fairy: 'rgb(250, 126, 147)',
    fighting: 'orange',
    psychic: 'purple',
    rock: 'rgb(65, 65, 65)',
    ghost: 'rgb(16, 12, 54)',
    ice: 'rgb(109, 128, 236)',
    dragon: 'rgb(248, 59, 59)',
    normal: 'gray'
}

async function loadPokemon() {
    let url = `https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0`;
    let response = await fetch(url);
    const { results: allPokemon } = await response.json();

    for (let i = 0; i < 4; i++) {
        let url = `${allPokemon[i].url}`;
        let response = await fetch(url);
        let pokemon = await response.json();

        renderCards(pokemon, i);
        log(pokemon)
    }
}

function renderCards(pokemon, i) {
    let container = document.querySelector('#pokedexContainer');
    container.innerHTML += cardTemplate(pokemon, i);
    setBackground(pokemon, i);
}

function cardTemplate(pokemon, i) {
    return `
        <div id="singlePokemonContainer" class="d-none" onclick="closeSinglePokemon(), toggleArrows(${i})"></div>

        <div class="singleCard" id="singleCard${i}" onclick="openSinglePokemon(${i}), toggleArrows(${i});">
            <div class="name" id="name${i}">
                <img id="arrow-left${i}" class="arrow-left d-none" src="/img/arrow-left.png" onclick="previousPokemon(${pokemon}, ${i})">
                <div>${pokemon.name.toUpperCase()}</div>
                <img id="arrow-right${i}" class="arrow-right d-none" src="/img/arrow-right.png" onclick="nextPokemon(${pokemon}, ${i})">
            </div>

            <div class="pokemonImage" style="background: url(${pokemon.sprites.other['official-artwork'].front_default}) no-repeat center; background-size: contain;"></div>

            <div class="category">${pokemon.types[0].type.name.toUpperCase()}</div>
            ${renderSinglePokemonBottom(pokemon, i)}
        </div>
    `;
}

function setBackground({types: [{type: {name}}]}, i) {
    let pokemonSingleCard = document.querySelector('#singleCard' + i);
    let singleCardLowerPart = document.querySelector('#lower-part' + i);
    pokemonSingleCard.style.backgroundColor = typeColors[name];
    singleCardLowerPart.style.backgroundColor = typeColors[name];
}

function renderSinglePokemonBottom({ stats: [{ base_stat: HP }, { base_stat: Attack }, { base_stat: Defense }, { base_stat: specialAttack }, { base_stat: specialDefense }, { base_stat: speed }],
                                     moves: [{move: {name: move1}}, {move: {name: move2}}, {move: {name: move3}}, {move: {name: move4}}, {move: {name: move5}}, {move: {name: move6}}],
                                     sprites: {front_default: gameGraphic}}, i) {
    return `
        <div class="lower-part" id="lower-part${i}">
            ${renderInfoLink(i)}
            ${renderStats(HP, Attack, Defense, specialAttack, specialDefense, speed, i)}
            ${renderMoves(move1, move2, move3, move4, move5, move6, i)}
            ${renderGameGraphic(gameGraphic, i)}
        </div>
    `;
}

function renderInfoLink(i) {
    return `
        <div class="infoLink">
            <span onclick="toggleStats(${i})">
                Stats
            </span>

            <span onclick="toggleMoves(${i})">
                Moves
            </span>

            <span onclick="toggleGameGraphic(${i})">
                Game Graphic
            </span>
        </div>
    `;
}

function renderStats(HP, Attack, Defense, specialAttack, specialDefense, speed, i) {
    return `
        <div class="stats" id="stats${i}">
            ${renderHp(HP)}
            ${renderAttack(Attack)}
            ${renderDefense(Defense)}
            ${renderSpecialAttack(specialAttack)}
            ${renderSpecialDefense(specialDefense)}
            ${renderSpeed(speed)}
        </div>
    `;
}

function renderHp(HP) {
    return `
        <div>
            <div>
                <span>HP</span>
                <div class="green" style="--percentage: ${HP / 120}"></div>
            </div>
            <div>${HP}</div>
        </div>
    `;
}

function renderAttack(Attack) {
    return `
        <div>
            <div>
                <span>ATK</span>
                <div class="red" style="--percentage: ${Attack / 120}"></div>
            </div>
            <div>${Attack}</div>
        </div>
    `;
}

function renderDefense(Defense) {
    return `
        <div>
            <div>
                <span>DEF</span>
                <div class="yellow" style="--percentage: ${Defense / 120}"></div>
            </div>
            <div>${Defense}</div>
        </div>
    `;
}

function renderSpecialAttack(specialAttack) {
    return `
        <div>
            <div>
                <span>S-ATK</span>
                <div class="brown" style="--percentage: ${specialAttack / 120}"></div>
            </div>
            <div>${specialAttack}</div>
        </div>
    `;
}

function renderSpecialDefense(specialDefense) {
    return `
        <div>
            <div>
                <span>S-DEF</span>
                <div class="orange" style="--percentage: ${specialDefense / 120}"></div>
            </div>
            <div>${specialDefense}</div>
        </div>
    `;
}

function renderSpeed(speed) {
    return `
        <div>
            <div>
                <span>SPD</span>
                <div class="blue" style="--percentage: ${speed / 120}"></div>
            </div>
            <div>${speed}</div>
        </div>
    `;
}

function renderMoves(move1, move2, move3, move4, move5, move6, i) {
    return `
        <div class="moves d-none" id="moves${i}">
            <span><ul>${move1.charAt(0).toUpperCase() + move1.slice(1)}</ul></span>
            <span><ul>${move2.charAt(0).toUpperCase() + move2.slice(1)}</ul></span>
            <span><ul>${move3.charAt(0).toUpperCase() + move3.slice(1)}</ul></span>
            <span><ul>${move4.charAt(0).toUpperCase() + move4.slice(1)}</ul></span>
            <span><ul>${move5.charAt(0).toUpperCase() + move5.slice(1)}</ul></span>
            <span><ul>${move6.charAt(0).toUpperCase() + move6.slice(1)}</ul></span>
        </div>
    `;
}

function renderGameGraphic(gameGraphic, i) {
    return `
        <div id="gameGraphic${i}" class="gameGraphic d-none">
            <img src="${gameGraphic}" class="gameGraphic">
        </div>
    `;
}

function previousPokemon(pokemon, i) {
    
}

function nextPokemon(pokemon, i) {

}

function openSinglePokemon(i) {
    if(document.querySelector('#singleCard' + i).classList.contains('singleCard-clicked')) return;
    document.querySelector('#singleCard' + i).classList.toggle('singleCard-clicked');
    document.querySelector('#singleCard' + i).classList.toggle('singleCard');
    document.querySelector('#singlePokemonContainer').classList.toggle('d-none');
    document.querySelector('#lower-part' + i).classList.toggle('lower-part-active');
}

function closeSinglePokemon() {
    document.querySelector('.singleCard-clicked').classList.toggle('singleCard');
    document.querySelector('#singlePokemonContainer').classList.toggle('d-none');
    document.querySelector('.singleCard-clicked .lower-part').classList.toggle('lower-part-active');
    document.querySelector('.singleCard-clicked').classList.toggle('singleCard-clicked');
    // document.querySelector('#arrow-left'+ i).classList.add('d-none');
    // document.querySelector('#arrow-right'+ i).classList.add('d-none');
    // document.querySelector('#name'+ i).classList.remove('space-between');
}

function toggleArrows(i) {
    document.querySelector('#arrow-left'+ i).classList.toggle('d-none');
    document.querySelector('#arrow-right'+ i).classList.toggle('d-none');
    document.querySelector('#name'+ i).classList.toggle('space-between');
}

function toggleStats(i) {
    document.querySelector('#stats'+ i).classList.remove('d-none');
    document.querySelector('#moves'+ i).classList.add('d-none');
    document.querySelector('#gameGraphic'+ i).classList.add('d-none');
}

function toggleMoves(i) {
    document.querySelector('#moves'+ i).classList.remove('d-none');
    document.querySelector('#stats'+ i).classList.add('d-none');
    document.querySelector('#gameGraphic'+ i).classList.add('d-none');
}

function toggleGameGraphic(i) {
    document.querySelector('#gameGraphic'+ i).classList.remove('d-none');
    document.querySelector('#stats'+ i).classList.add('d-none');
    document.querySelector('#moves'+ i).classList.add('d-none');
}



// -- DARK MODE --

function toggleDarkMode() {
    document.querySelector('#pokedexContainer').classList.toggle('dark-mode');
    document.querySelector('.slider__bar').classList.toggle('slider__bar__active');
}

function openMenu() {
    document.querySelector('.menu-inactive').classList.toggle('menu');
}