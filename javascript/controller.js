import {Thumbnail} from './Thumbnail.js'
import {view} from './view.js'

const data =  {
  previousSelection: null,
  currentSelection: null,
  thumbnails: [],
  randGifs: [],
  numGifsLoaded: 0,
  gifTimer: null
}

export const controller = {

  init: function () {
    this.createThumbnails().then(view.init());
  },

  createThumbnails: function () {
    return new Promise ((resolve, reject) => {
      let moments = document.getElementsByClassName('gallery-item');

      for (let i = 0; i < moments.length; i ++) {
        let thumbnail = new Thumbnail(moments[i]);

        data.thumbnails.push(thumbnail);
      }
    });
  },

  getThumbnails: function (length, maxNum, randomize = false) {
    if (randomize) {
      let randIndexes = this.getRandNumArray(length, maxNum);
      let randThumbnails = [];

      for (let i = 0; i < length; i++) {
        let thumbnail = data.thumbnails[randIndexes[i]];

        randThumbnails.push(thumbnail);
      }

      return randThumbnails;

    } else {

      return data.thumbnails;
    }
  },

  setSelection: function (currentSelection = null) {
    if (data.currentSelection) {
      if (currentSelection && data.currentSelection.container.dataset.index !== currentSelection.container.dataset.index) {

        data.previousSelection = data.currentSelection;
        data.currentSelection = currentSelection;

      } else {

        data.previousSelection = data.currentSelection;
        data.currentSelection = null
      }

    } else {
      data.previousSelection = null;
      data.currentSelection = currentSelection;
    }
  },

  getSelections: function () {
    return {previous: data.previousSelection, current: data.currentSelection};
  },

  createGifs: function () {
    return new Promise ((resolve, reject) => {
      let links = fetch("./json/videos.json").then(response => {
        return response.json();

      }).then(jsondata => {
        let index = 0;
        let minGifsLoaded = false;

        for (let property in jsondata) {
          let thumbnail = data.thumbnails[index]

          thumbnail.createGif(jsondata[property].thumbnail).then(() => {

            if (data.numGifsLoaded > 10 && !minGifsLoaded) {
              minGifsLoaded = true;

              this.setGifs();
              resolve();
            }

            data.numGifsLoaded ++;
          });

          index ++;
        }
      });
    });
  },

  setGifs: function () {
    data.randGifs = this.getThumbnails(5, data.numGifsLoaded, true);
  },

  getGifs: function () {
    return data.randGifs;
  },

  setGifTimer: function (timer = null) {
    data.gifTimer = timer;
  },

  getGifTimer: function () {
    return data.gifTimer
  },

  getRandNumArray: function (length, maxNum) {
    let randNums = [];

    while (randNums.length < length) {
      let randNum = Math.floor(Math.random() * maxNum);

      if (randNums.indexOf(randNum) === -1) randNums.push(randNum);
    }

    return randNums;
  }
}
