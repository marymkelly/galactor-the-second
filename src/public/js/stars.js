const $infoLineOne = document.querySelector('#active-star');
const $leftBtn = document.querySelector('#button-left');
const $rightBtn = document.querySelector('#button-right');
const $aladinContainer = document.querySelector('#aladin-lite-div');
const $aladinFocusedContainer = document.querySelector('#aladin-lite-div2');

let aladin = A.aladin('#aladin-lite-div',
  {
    survey: 'P/DSS2/color', // set initial image survey
    cooFrame: 'ICRSd', // set galactic frame
    showReticle: false,
    showZoomControl: false,
    showFullscreenControl: false,
    showLayersControl: false,
    showGotoControl: false,
    showShareControl: false,
    showSimbadPointerControl: false,
    showFrame: false,
    fullScreen: false,
    showFov: false
  });

let aladinFocused = A.aladin('#aladin-lite-div2',
  {
    survey: 'P/DSS2/color', // set initial image survey
    cooFrame: 'ICRSd', // set galactic frame
    fov: 1,
    showReticle: false,
    showZoomControl: false,// the zoom control GUI is displayed (plus/minus buttons)	
    showFullscreenControl: false,
    showLayersControl: false,
    showGotoControl: false,
    showShareControl: false,
    showSimbadPointerControl: false,
    showFrame: false,
    fullScreen: false
  });

let cat = A.catalog({ color: 'blue', sourceSize: 14, shape: 'circle', onClick: 'objectClicked' });
let objSelected;

$rightBtn.addEventListener('click', () => { getNextSource('right') });
$leftBtn.addEventListener('click', () => { getNextSource('left') });

aladin.setFovRange(35, 40)
aladin.setFov(40)
aladinFocused.setFovRange(.3, 2)

socket.on('starData', (data) => {
  const sourcesArr = [];
  const starArr = data.res.stars;
  const userLocation = data.loc;
  if (aladin.view.catalogs[0]) { //reset catalog and sources instances
    aladin.view.catalogs[0].sources = [];
    aladin.view.catalogs.pop()
  }
  //update aladin catalog view container based off user location
  aladin.gotoRaDec(userLocation.ra, userLocation.dec)

  //push each star formatted as catalog source items
  starArr.forEach((item) => {
    sourcesArr.push(A.source(item.ra[0], item.de[0], { name: item.catId[0], target: item.target[0] }));
  })
  //create catalog
  aladin.addCatalog(cat);
  cat.addSources(sourcesArr);
  //update aladin focused container
  updateStarView(sourcesArr[0]);
})

// define function triggered when  a source is hovered
aladin.on('objectHovered', function (object) {
  if (object) {
    $infoLineOne.innerHTML = 'Currently Viewing <strong>' + object.data.name + '</strong>';
    aladinFocused.gotoObject(object.data.target);
  }
  else {
    $infoLineOne.innerHTML = 'Currently Selected <strong>' + objSelected.data.name + '</strong>';
    aladinFocused.gotoObject(objSelected.data.target);
  }
});
// define function triggered when an object is clicked
aladin.on('objectClicked', function (object) {
  if (object) {
    if (objSelected) {
      objSelected.deselect();
    }
    updateStarView(object);
  }
  else {
    updateStarView(objSelected); //will prevent deselect when clicking outside of source object
  }
});

function getNextSource(btn) { //changes selected source based on left and right buttons
  let nextSource;
  const sourceArr = aladin.view.catalogs[0].sources;
  const matching = (element) => (element.data.target === objSelected.data.target);
  let index = sourceArr.findIndex(matching);

  if (index !== -1 && index < sourceArr.length) {
    let currentSource = sourceArr[index];
    currentSource.deselect();

    if (btn === 'right') {
      if (index === (sourceArr.length - 1)) {
        index = -1;
      }
      nextSource = sourceArr[index + 1];
    }

    if (btn === 'left') {
      if (index === 0) {
        index = sourceArr.length;
      }
      nextSource = sourceArr[index - 1];
    }
    updateStarView(nextSource);
  }
}

function updateStarView(obj) { //update aladin containers per source selection
  obj.select();
  objSelected = obj;
  aladinFocused.gotoObject(obj.data.target);
  aladinFocused.adjustFovForObject(obj.data.target);
  $infoLineOne.innerHTML = 'Currently Selected <strong>' + objSelected.data.name + '</strong>';
}


