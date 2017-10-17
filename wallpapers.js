angular.module("agendasApp")
  .value("wallpapers", {
    images: {
      "supermoon-over-san-francisco": {
        name: "Supermoon Over San Francisco",
        url: "https://upload.wikimedia.org/wikipedia/commons/b/b4/Supermoon_over_San_Francisco%2C_November_2016.jpg",
        credit: "By Dllu (Own work) [CC BY-SA 4.0 (https://creativecommons.org/licenses/by-sa/4.0)], via Wikimedia Commons",
        creditURL: "https://commons.wikimedia.org/wiki/File%3ASupermoon_over_San_Francisco%2C_November_2016.jpg"
      },
      "san-francisco-ferry-building-dawn": {
        name: "San Francisco Ferry Building at Dawn",
        url: "https://upload.wikimedia.org/wikipedia/commons/6/6c/San_Francisco_Ferry_Building_at_Dawn.jpg",
        credit: "By Brooklyn Peach (Own work) [CC BY-SA 4.0 (https://creativecommons.org/licenses/by-sa/4.0)], via Wikimedia Commons",
        creditURL: "https://commons.wikimedia.org/wiki/File%3ASan_Francisco_Ferry_Building_at_Dawn.jpg"
      },
      "san-francisco-skyline": {
        name: "San Francisco Skyline from Coit Tower",
        url: "https://upload.wikimedia.org/wikipedia/commons/6/6a/San_Francisco_skyline_from_Coit_Tower.jpg",
        credit: "By Supercarwaar (Own work) [CC BY-SA 4.0 (https://creativecommons.org/licenses/by-sa/4.0)], via Wikimedia Commons",
        creditURL: "https://commons.wikimedia.org/wiki/File%3ASan_Francisco_skyline_from_Coit_Tower.jpg"
      },
      "san-francisco-sunset": {
        name: "San Francisco (Sunset)",
        url: "https://upload.wikimedia.org/wikipedia/commons/4/43/San_Francisco_%28Sunset%29.jpg",
        credit: "By Basil D Soufi (Own work) [CC BY-SA 3.0 (https://creativecommons.org/licenses/by-sa/3.0)], via Wikimedia Commons",
        creditURL: "https://commons.wikimedia.org/wiki/File%3ASan_Francisco_(Sunset).jpg"
      },
      "shanghai-view": {
        name: "Shanghaiviewpic1",
        url: "https://upload.wikimedia.org/wikipedia/commons/a/ad/Shanghaiviewpic1.jpg",
        credit: "By dawvon (Pudong) [CC BY 2.0 (http://creativecommons.org/licenses/by/2.0)], via Wikimedia Commons",
        creditURL: "https://commons.wikimedia.org/wiki/File%3AShanghaiviewpic1.jpg"
      },
      "shanghai-skyline": {
        name: "Shanghai Skyline, Dec 2014",
        url: "https://upload.wikimedia.org/wikipedia/commons/b/b2/Shanghai_Skyline%2C_Dec2014.jpg",
        credit: "By Simon Desmarais [CC BY-SA 2.0 (https://creativecommons.org/licenses/by-sa/2.0)], via Wikimedia Commons",
        creditURL: "https://commons.wikimedia.org/wiki/File%3AShanghai_Skyline%2C_Dec2014.jpg"
      },
      "shanghai-century-park": {
        name: "Shanghai Century Park at Sunset",
        url: "https://upload.wikimedia.org/wikipedia/commons/c/c2/Shanghai_Century_park_at_sunset.jpg",
        credit: "By Mgmoscatello (Own work) [CC BY-SA 3.0 (https://creativecommons.org/licenses/by-sa/3.0)], via Wikimedia Commons",
        creditURL: "https://commons.wikimedia.org/wiki/File%3AShanghai_Century_park_at_sunset.jpg"
      },
      "dawn-of-shanghai": {
        name: "Dawn of Shanghai",
        url: "https://upload.wikimedia.org/wikipedia/commons/5/5c/Dawn_of_Shanghai.JPG",
        credit: "By Leoyunyi (Own work) [CC BY-SA 4.0 (https://creativecommons.org/licenses/by-sa/4.0)], via Wikimedia Commons",
        creditURL: "https://commons.wikimedia.org/wiki/File%3ADawn_of_Shanghai.JPG"
      }
    },
    options: {
      "san-francisco": {
        name: "San Francisco",
        images: {
          dawn: "san-francisco-ferry-building-dawn",
          day: "san-francisco-skyline",
          sunset: "san-francisco-sunset",
          night: "supermoon-over-san-francisco"
        }
      },
      "shanghai": {
        name: "Shanghai",
        images: {
          dawn: "dawn-of-shanghai",
          day: "shanghai-skyline",
          sunset: "shanghai-century-park",
          night: "shanghai-view"
        }
      }
    }
  })
