
let maxSize = 4;
let mapCache = new Map();


let min1Key = null;
let min1Weight = null;
let min1LastAccessTime = null;

let min2Key = null;
let min2Weight = null;
let min2LastAccessTime = null;

let lastKey = null;
let lastWeight = null;
let lastAccessTime = null;

exports.showCache = () => {
    for (let key of mapCache.keys()) {
        console.log(key + ":" + JSON.stringify(mapCache.get(key)));
    }
}

exports.showAll = () => {
  this.showCache();
  console.log("min1Key:" + min1Key);
  console.log("min2Key:" + min2Key);
  console.log("lastKey:" + lastKey);
}

exports.init = () => {
      this.put("Apple", "It is red", 1);
    this.put("Orange", "It is an orange fruit", 2);
    this.put("3", "3", 3);
    this.put("smile", ";)", 4);
   
}
 
exports.setMaxSize = (value) => {
    if (maxSize > 3) {
        maxSize = value;
    }  
}

exports.calculateScore = (weight, lastAccessTime, currentTime) => {
    return weight / Math.log10(currentTime - lastAccessTime + 1); 
}

exports.put = (key, value, weight) => {


    if (isNaN(weight)) {
        return;
    }
 
    let current_time = new Date();

    if (mapCache.size == 0) {
        min1Key = key;
        min1Weight = weight;
        min1LastAccessTime = current_time;
        mapCache.set(key, {"value": value, "weight": weight, "lastAccessTime": current_time});
    } else if (mapCache.size == 1) {
        min2Key = key;
        min2Weight = weight;
        min2LastAccessTime = current_time;
        mapCache.set(key, {"value": value, "weight": weight, "lastAccessTime": current_time});
    } else if (mapCache.size == 2) {
        lastKey = key;
        lastWeight = weight;
        lastLastAccessTime = current_time;
        mapCache.set(key, {"value": value, "weight": weight, "lastAccessTime": current_time});
    } else {
        let result = this.compareScore(key, weight, current_time);
        if (mapCache.size < maxSize) {
          mapCache.set(key, {"value": value, "weight": weight, "lastAccessTime": current_time});
        } else {
          if (result.update == true) {
              mapCache.set(key, {"value": value, "weight": weight, "lastAccessTime": current_time});
          }
          if (result.delete == true) {
              mapCache.delete(result.lastKey);
          }
        }
    }
}

exports.get = (key) => {
    let obj = mapCache.get(key);
    if (obj == null) {
        return -1;
    } else {
      let current_time = new Date();
      mapCache.set(key, {"value": obj.value, "weight": obj.weight, "lastAccessTime": current_time});      
      this.compareScore(key, obj.weight, current_time);
      return obj.value;
    }
}

exports.compareScore = (key, weight, current_time) => {

  let result = {
      "update": false,
      "delete": false,
      "lastKey": ""
  }


  if (key == min1Key || key == min2Key || key == lastKey) {
      result.update = true;
      return result;
  }

  let min1Score = this.calculateScore(min1Weight, min1LastAccessTime, current_time);
  let min2Score = this.calculateScore(min2Weight, min2LastAccessTime, current_time);
  let lastScore = this.calculateScore(lastWeight, lastAccessTime, current_time);
  let currentScore = weight / -1000;


  if (lastScore > min1Score) {
      if (min1Score > min2Score) {

          let tempKey = min2Key;
          let tempWeight = min2Weight;
          let tempLastAccessTime = min2LastAccessTime;
          let tempScore = min2Score;

          min2Key = lastKey;
          min2Weight = lastWeight;
          min2LastAccessTime = lastAccessTime;
          min2Score = lastScore;

          lastKey = tempKey;
          lastWeight = tempWeight
          lastAccessTime = tempLastAccessTime;
          lastScore = tempScore;
      } else {

          let tempKey = min1Key;
          let tempWeight = min1Weight;
          let tempLastAccessTime = min1LastAccessTime;
          let tempScore = min1Score;

          min1Key = lastKey;
          min1Weight = lastWeight;
          min1LastAccessTime = lastAccessTime;
          min1Score = lastScore;

          lastKey = tempKey;
          lastWeight = tempWeight
          lastAccessTime = tempLastAccessTime;
          lastScore = tempScore;
      }
  } else if (lastScore > min2Score) {

      let tempKey = min2Key;
      let tempWeight = min2Weight;
      let tempLastAccessTime = min2LastAccessTime;
      let tempScore = min2Score;

      min2Key = lastKey;
      min2Weight = lastWeight;
      min2LastAccessTime = lastAccessTime;
      min2Score = lastScore;

      lastKey = tempKey;
      lastWeight = tempWeight
      lastAccessTime = tempLastAccessTime;
      lastScore = tempScore;
  }

  console.log("currentScore: " + currentScore);
  console.log("lastScore: " + lastScore);
  if (currentScore > lastScore) {

      result.update = true;
      result.delete = true;
      result.lastKey = lastKey;

      lastKey = key;
      lastWeight = weight
      lastAccessTime = current_time;
      
  }
  return result;
}