/// TODO: player should have No matches when starting

//https://static.wikia.nocookie.net/fortnite_gamepedia/images/6/6e/Storm_holding_icon.png
//https://static.wikia.nocookie.net/fortnite_gamepedia/images/e/e1/Storm_moving_icon.gif


const mapSource = 'https://pbs.twimg.com/media/FjHqlfPaAAAFOPR?format=jpg&name=large';
const costumeImages = ['https://static.wikia.nocookie.net/fortnite/images/9/90/Blue_Squire_%28New%29_-_Outfit_-_Fortnite.png', 'https://static.wikia.nocookie.net/fortnite/images/d/d5/New_Sparkle_Specialist.png', 'https://static.wikia.nocookie.net/fortnite/images/1/11/Rust_Lord_%28New%29_-_Outfit_-_Fortnite.png', 'https://static.wikia.nocookie.net/fortnite/images/d/d9/Elite_Agent_%28New%29_-_Outfit_-_Fortnite.png', 'https://static.wikia.nocookie.net/fortnite/images/6/62/Zoey_%28New%29_-_Outfit_-_Fortnite.png', 'https://static.wikia.nocookie.net/fortnite/images/4/47/The_Visitor_%28New%29_-_Outfit_-_Fortnite.png', 'https://static.wikia.nocookie.net/fortnite/images/f/f2/Redline_%28New%29_-_Outfit_-_Fortnite.png', 'https://static.wikia.nocookie.net/fortnite/images/d/d8/Rook_%28New%29_-_Outfit_-_Fortnite.png', 'https://static.wikia.nocookie.net/fortnite/images/7/7f/DJ_Yonder_%28New%29_-_Outfit_-_Fortnite.png', 'https://static.wikia.nocookie.net/fortnite_gamepedia/images/3/38/The_Autumn_Queen.png', 'https://static.wikia.nocookie.net/fortnite_gamepedia/images/1/1d/T-Soldier-HID-825-Athena-Commando-F-SportsFashion-L.png', 'https://static.wikia.nocookie.net/fortnite_gamepedia/images/5/5e/New_Ice_Queen.png', 'https://static.wikia.nocookie.net/fortnite_gamepedia/images/f/fc/New_Cloacked_Star.png', 'https://static.wikia.nocookie.net/fortnite_gamepedia/images/1/1a/New_Kuno.png', 'https://static.wikia.nocookie.net/fortnite_gamepedia/images/f/fe/T_Kairos_ConstructorM_L.png', 'https://static.wikia.nocookie.net/fortnite_gamepedia/images/c/cf/New_Lynx.png', 'https://static.wikia.nocookie.net/fortnite_gamepedia/images/5/5e/Newer_Raptor.png', 'https://static.wikia.nocookie.net/fortnite_gamepedia/images/8/8e/Rue.png', 'https://static.wikia.nocookie.net/fortnite_gamepedia/images/5/51/New_Fishstick.png'];

// Match Tiles Tyoes
class TileType {
  constructor(name, emoji, src) {
    this.name = name;
    this.emoji = emoji;
    this.src = src;
  }
}

class MatchGroup {
  constructor() {
    this.tiles = [];
    this.hMatches = 0;
    this.vMatches = 0;
    this.tiles = 0;
  }
}

class Resource {
  constructor(name, maxValue, currentValue) {
    this.name = name;
    this.maxValue = maxValue;
    this.currentValue = currentValue;
    this.onValueChange = function() {};
  }

  changeValue(amount) {
    if (this.currentValue + amount > this.maxValue) {
      this.currentValue = this.maxValue;
    } else if (this.currentValue + amount < 0) {
      this.currentValue = 0;
    } else {
      this.currentValue += amount;
    }
    if (this.onValueChange !== null)
      this.onValueChange();
  }

  setValue(amount) {
    this.changeValue(amount - this.currentValue);
  }
}

class Player {
  constructor(name) {
    this.name = name;
    this.health = new Resource('health', 100, 100);
    this.shield = new Resource('shield', 100, 100);
    this.ammo = new Resource('ammo', 100, 100);
    this.weapon = new Weapon('pistol', 1, 5);
    this.onHurt = function() {};
    this.onDeath = function() {};
  }
  hurt(damage) {
    if (damage <= 0)
      return false;
    if (this.shield.currentValue > 0) {
      this.shield.changeValue(-damage);
    } else {
      this.health.changeValue(-damage);
    }
    //console.log(this.name + ' was hurt for ' + damage);
    this.onHurt();
    if (!this.isAlive())
    	this.onDeath();
  }
  shoot(e) {
    if (this.ammo.currentValue <= 0) {
      return false;
    }
    //console.log('shooting ' + this.weapon.name);
    this.ammo.changeValue(-1);
    e.hurt(this.weapon.damage);
    return true;
  }
  isAlive() {
    return this.health.currentValue > 0;
  }
}

class Weapon {
  constructor(name, firerate, damage) {
    this.name = name;
    this.firerate = firerate;
    this.damage = damage;
  }
}

class Tile {
  constructor(element, type, x, y) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.element = element;
    var img = document.createElement('img');
    img.src = type.src;
    img.style.height = '62px';
    img.style.width = '62px';
    //img.style.opacity = '0.5';
    element.appendChild(img);
    //element.innerHTML = type.emoji;
    this.element.tile = this;
  }
  updateElement() {
    this.element.style.top = `${tileYOffset + this.y * 55}px`;
    this.element.style.left = `${tileXOffset + this.x * 55}px`;
  }
}

var tileYOffset = 1;
var tileXOffset = 0;
var inputAllowed = true;

var loot = new TileType('loot', '💰', 'https://static.wikia.nocookie.net/fortnite/images/9/94/Chest_%28Old%29_-_Chest_-_Fortnite.png');
var health = new TileType('health', '💊', 'https://static.wikia.nocookie.net/fortnite_gamepedia/images/0/0e/Consumable_bandage.png');
var shield = new TileType('shield', '🛡️', 'https://static.wikia.nocookie.net/fortnite/images/d/d9/Shield_Potion_-_Item_-_Fortnite.png');
var ammo = new TileType('ammo', '🔫', 'https://static.wikia.nocookie.net/fortnite/images/d/da/Ammo_Box_-_Container_-_Fortnite.png');
var mats = new TileType('mats', '🪵', 'https://static.wikia.nocookie.net/fortnite_gamepedia/images/f/f2/Wood_icon.png');
var movement = new TileType('movement', '👟', 'https://static.wikia.nocookie.net/fortnite_gamepedia/images/f/f2/Wood_icon.png');
//var tileTypes = [loot, health, shield, ammo];
var tileTypes = [loot, health, shield, ammo, movement];

var gameRows = 7;
var gameColumns = 7;
var tiles;
var selectedTile;
var removedTiles = [];

var siteContainer = document.getElementById('container');

var player = new Player('You');

var enemy = null;

var puzzleContainer;
var visualContainer;
var map;
var enemyAvatar;
//enemyAvatar.style.display = 'none';


startGame();

function startGame() {
  visualContainer = document.createElement('div');
  visualContainer.className = 'visual-container';
  map = document.createElement('img');
  map.src = mapSource;
  map.className = 'map';
  var r = Math.floor(Math.random() * 360);
  map.style.transform = 'rotate(' + r + 'deg)';
  map.style.bottom = (Math.floor(Math.random() * 400) + 200) + 'px';
  visualContainer.appendChild(map);
  document.body.appendChild(visualContainer);

  puzzleContainer = document.createElement('div');
  puzzleContainer.className = 'puzzle-container';
  document.body.appendChild(puzzleContainer);

  createGrid(gameRows, gameColumns, puzzleContainer);
  addResourceBar(player.health, 'red');
  addResourceBar(player.shield, 'blue');
  createResourceCounter(player.ammo);
  player.health.changeValue(100);
  player.shield.setValue(0);
  player.ammo.setValue(0);
  setTimeout(startEncounter, 30000);

}

function startEncounter() {
  if (enemy !== null) {
    //Still fighting an enemy
    return;
  }
  enemy = generateEnemy();
  if (enemyAvatar != null)
    enemyAvatar.remove();
  enemyAvatar = createAvatar(costumeImages[Math.floor(Math.random() * costumeImages.length)], visualContainer);
  enemy.onHurt = function() {
    shakeIt(enemyAvatar)
  };
	enemy.onDeath = function(){
  	enemyAvatar.remove();
    enemy = null;
    setTimeout(startEncounter, 30000);
  }
  enemyAvatar.style.animation = 'enemySpawn .5s';
  enemyAvatar.style.animationIterationCount = '1';
  setTimeout(function() {
    enemyAvatar.style.animation = '';
  }.bind(enemyAvatar), 500);
  
  setTimeout(triggerAttack, 1000, player, enemy);
  setTimeout(triggerAttack, 1000, enemy, player);
}

function triggerAttack(attacker, victim) {
  if (attacker.isAlive() && victim.isAlive())
    attacker.shoot(victim);

  setTimeout(triggerAttack, attacker.weapon.firerate * 1000, attacker, victim);
  //shakeIt(enemyAvatar);  
}

function generateEnemy() {
  var e = new Player('Bot');
  e.ammo.setValue(Math.floor(Math.random() * 99));
  e.shield.setValue(Math.floor(Math.random() * 99));
  e.health.setValue(Math.floor(Math.random() * 99));
  return e;
}

function createResourceCounter(resource) {

  const resourceDiv = document.createElement('div');
  const current = document.createElement('span');
  current.innerHTML = resource.currentValue;
  const max = document.createElement('span');
  max.innerHTML = resource.maxValue;
  const slash = document.createElement('span');
  slash.innerHTML = '/';
  resourceDiv.className = 'resource-item-' + resource.name;
  resourceDiv.appendChild(current);
  resourceDiv.appendChild(slash);
  resourceDiv.appendChild(max);
  document.body.appendChild(resourceDiv);
  //document.getElementById('container').appendChild(resourceDiv);

  resource.onValueChange = function() {
    current.innerHTML = resource.currentValue;
  };


  return resourceDiv;
}

function createAvatar(src, container) {
  var img = document.createElement('img');
  img.src = src;
  img.className = 'enemy-avatar';
  container.appendChild(img);
  return img;
}

function addResourceBar(resource, color) {
  var resourceBar = document.createElement('div');
  //resourceBar.id = resource.name;
  resourceBar.className = 'resource-bar-' + resource.name;
  //sourceBar.style.width = '100px';
  //sourceBar.style.height = '10px';
  //resourceBar.style.backgroundColor = 'black';
  //resourceBar.style.border = '1px solid white';
  //resourceBar.style.margin = '5px';
  resourceBar.style.position = 'relative';
  //resourceBar.style.display = 'float'; // 'inline-block';
  //resourceBar.style.overflow = 'hidden';
  var resourceBarFill = document.createElement('div');
  resourceBarFill.className = 'resource-bar-' + resource.name + '-fill';
  resourceBarFill.style.width = '100%';
  resourceBarFill.style.height = '100%';
  //resourceBarFill.style.backgroundColor = color;
  resourceBarFill.style.position = 'absolute';
  resourceBarFill.style.top = '0';
  resourceBarFill.style.left = '0';
  resourceBar.appendChild(resourceBarFill);
  document.body.appendChild(resourceBar);
  //document.getElementById('container').appendChild(resourceBar);
  //resource.event.addEventListener('change', (e) => {
  //resourceBarFill.style.width = (resource.currentValue / resource.maxValue) * 100 + '%';}, false);
  //console.log(resource == undefined);
  resource.onValueChange = function() {
    resourceBarFill.style.width = (this.currentValue / this.maxValue) * 100 + '%';
  };
}


//var selectionOutline = createSelectionOutline(document.body);

function createSelectionOutline(container) {
  var div = document.createElement('div');
  div.classList.add('selection-outline');
  //div.style.borderColor = 'transparent';
  container.appendChild(div);
  return div;
}



function selectTile(tile) {
  if (selectedTile == null) {
    tile.element.style.animation = 'pulse .5s';
    tile.element.style.animationIterationCount = 'infinite';
    selectedTile = tile;
    return;
  }

  if (selectedTile === tile) {
    deselectTile(tile);
    return;
  }

  if (checkForAdjacent(tile, selectedTile)) {
    // pause player control
    inputAllowed = false;

    var tempTile = selectedTile;
    deselectTile(selectedTile);

    swapTiles(tile, tempTile);
    setTimeout(checkBoard, 200, tile, tempTile);
  } else {
    deselectTile(selectedTile);
    selectTile(tile);
  }


}

function waterfall() {
  for (let x = tiles.length - 1; x >= 0; x--) {
    var column = tiles[x];
    column = removeNullAndUndefined(column);
    while (column.length < gameRows) {
      var t = createNewTile(x, 0, puzzleContainer);
      column.unshift(t);
    }
    for (let y = 0; y < column.length; y++) {
      var tile = column[y];
      tile.y = y;
    }
    tiles[x] = column;
  }
}

function checkBoard(tile1, tile2) {
  //console.log('checking board');
  if (!collapseGroups()) {
    swapTiles(tile1, tile2);
    inputAllowed = true;
    return;
  } else {
    //shakeIt(enemyAvatar);
    waterfall();
    setTimeout(updateBoard, 250);
  }

}

function doubleCheckBoard() {
  if (collapseGroups()) {
    waterfall();
    setTimeout(updateBoard, 250);
  } else {
    inputAllowed = true;
  }
}

function updateBoard() {
  for (x = 0; x < tiles.length; x++) {
    for (y = 0; y < tiles[x].length; y++) {
      tiles[x][y].updateElement();
    }
  }
  for (var i = 0; i < removedTiles.length; i++) {
    removedTiles[i].element.remove();
  }
  removedTiles = [];
  setTimeout(doubleCheckBoard, 250);
}


function deselectTile(tile) {
  if (selectedTile !== tile)
    return;
  tile.element.style.animation = '';
  selectedTile = null;
}

function checkForAdjacent(tile1, tile2) {
  var xDiff = Math.abs(tile1.x - tile2.x);
  var yDiff = Math.abs(tile1.y - tile2.y);
  //console.log(xDiff + ', ' + yDiff);
  return ((xDiff == 0 && yDiff == 1) || (yDiff == 0 && xDiff == 1));
}

function createGrid(numRows, numCols, container) {
  tiles = [];
  for (var x = 0; x < numCols; x++) {
    var tileColumn = [];
    for (var y = 0; y < numRows; y++) {
      var div = document.createElement('div');
      div.style.fontSize = '1em';
      div.style.fontSize = '3em';
      div.style.textAlign = 'center';
      div.style.verticalAlign = 'middle';
      div.classList.add('selectTile');
      div.addEventListener('click', tileClickHandler);
      container.appendChild(div);

      var t = new Tile(div, tileTypes[Math.floor(Math.random() * tileTypes.length)], x, y);
      t.updateElement();
      tileColumn.push(t);
    }
    tiles.push(tileColumn);
  }
}

function createNewTile(x, y, container) {
  var div = document.createElement('div');
  //div.style.fontSize = '1em';
  div.style.fontSize = '3em';
  div.style.textAlign = 'center';
  div.style.verticalAlign = 'middle';
  div.classList.add('selectTile');
  div.addEventListener('click', tileClickHandler);
  container.appendChild(div);

  var t = new Tile(div, tileTypes[Math.floor(Math.random() * tileTypes.length)], x, -5);
  t.updateElement();
  return t;

}

function tileClickHandler(event) {
  if (!inputAllowed)
    return;
  selectTile(event.target.tile);
}

function swapTiles(tile1, tile2) {
  var x = tile1.x;
  var y = tile1.y;

  tile1.x = tile2.x;
  tile1.y = tile2.y;

  tile2.x = x;
  tile2.y = y;

  tile1.updateElement();
  tile2.updateElement();

  tiles[tile1.x][tile1.y] = tile1;
  tiles[tile2.x][tile2.y] = tile2;

}

function replaceTile(oldTile, newTile) {
  if (oldTile == undefined || newTile == undefined)
    return;
  //oldTile.element.color = 'transparent';
  newTile.x = oldTile.x;
  newTile.y = newTile.y;
  newTile.updateElement;
  tiles[oldTile.x][oldTile.y] = newTile;
  //setTimeout(oldTile.dissolve, 1000);
  oldTile.element.remove();
}

function collapseGroups() {
  var groups = findGroups();
  var found = false;
  for (let i = 0; i < groups.length; i++) {
    for (let j = 0; j < groups[i].length; j++) {
      if (groups[i][j] !== undefined) {
        var clearedTile = groups[i][j];
        turnInTile(clearedTile);
        tiles[clearedTile.x][clearedTile.y] = null;
        //clearedTile.element.style.color = 'transparent';
        clearedTile.element.style.opacity = '0';
        removedTiles.push(clearedTile);
        found = true
      }
    }
  }
  return found;
}

function turnInTile(tile) {
  switch (tile.type.name) {
    case 'health':
      player.health.changeValue(2);
      break;
    case 'shield':
      player.shield.changeValue(3);
      break;
    case 'ammo':
      player.ammo.changeValue(1);
      break;
    case 'movement':
      var p = map.style.left; // return value in px; i.e 50px
      p = p.substr(0, p.length - 2); // remove px ie : 50px becomes 50
      map.style.left = (+p) - 2 + 'px' // convert p to number and add 10
      break;
    default:
      console.log(`Not Reward for ${tile.type.name}.`);
  }

}

function removeNullAndUndefined(arr) {
  return arr.filter(function(item) {
    return item !== null && typeof item !== 'undefined';
  });
}

function findGroups() {
  let groups = [];
  for (let x = 0; x < tiles.length; x++) {
    for (let y = 0; y < tiles[x].length; y++) {
      var type = tiles[x][y].type;
      //check horizontal
      var group = [];
      group.push(tiles[x][y]);
      for (let x2 = x + 1; x2 < tiles.length; x2++) {
        if (tiles[x2][y].type === type) {
          group.push(tiles[x2][y]);
        } else {
          break;
        }
      }
      if (group.length >= 3) {
        groups.push(group);
      }


      //check vertical
      group = [];
      group.push(tiles[x][y]);
      for (let y2 = y + 1; y2 < tiles[x].length; y2++) {
        if (tiles[x][y2].type === type) {
          group.push(tiles[x][y2]);
        } else {
          break;
        }
      }
      if (group.length >= 3) {
        groups.push(group);
      }

    }
  }
  return groups;
}

/*
function findGroups() {
  var groups = [];
  var currentGroup = [];
  var row = 0;
  var column = 0;
  var currentTile = null;

  var neighborTile = null;

  var vMatches;
  var hMatches;
  for (let x = 0; x < tiles.length; x++) {
    currentTile = tiles[x];
    currentGroup = [currentTile];


    row = Math.floor(i / gameColumns);
    column = i % gameColumns;

    hMatches = [currentTile];
    // ignore this is tile to the left is the same
    if (!tilesMatch(currentTile, tiles[i - 1])) {
      //loop looking right
      for (let j = i + 1; j < gameColumns; j++) {
        neighborTile = tiles[j];
        if (!tilesMatch(currentTile, neighborTile))
          break;

        hMatches.push(neighborTile);
      }
    }
    if (hMatches.length >= 3) {
      groups.push(hMatches);
    }
    //loop looking down
  }
  return groups;
}

function tilesMatch(tile1, tile2) {
  if (tile1 == undefined || tile2 == undefined)
    return false;
  if (tile1.type === tile2.type)
    return true;

  return false;
}
*/

///// Deprecated Functions

function getIndexOfK(arr, k) {
  for (var i = 0; i < arr.length; i++) {
    var index = arr[i].indexOf(k);
    if (index > -1) {
      return [i, index];
    }
  }
}


function getNeighbors(arr, x, y) {
  var neighbors = [];
  //check top
  if (arr[y][x - 1] !== undefined) {
    neighbors.push(arr[y][x - 1]);
  }
  //check right
  if (arr[y + 1] !== undefined && arr[y + 1][x] !== undefined) {
    neighbors.push(arr[y + 1][x]);
  }
  //check bottom
  if (arr[y][x + 1] !== undefined) {
    neighbors.push(arr[y][x + 1]);
  }
  //check left
  if (arr[y - 1] !== undefined && arr[y - 1][x] !== undefined) {
    neighbors.push(arr[y - 1][x]);
  }
  return neighbors;
}

function getAdjacentTiles(tile) {
  var adjacents = [tiles[tile.y + 1][tile.x], tiles[tile.y - 1][tile.x], tiles[tile.y][tile.x + 1], tiles[tile.y][tile.x - 1]];
  return removeNullAndUndefined(adjacents);
}

function shakeIt(e) {
  e.style.animation = 'shake 0.5s';
  e.style.animationIterationCount = 'infinite';
  setTimeout(function() {
    e.style.animation = '';
  }.bind(e), 500);
}
