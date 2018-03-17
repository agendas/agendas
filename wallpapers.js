angular.module("agendasApp")
  .value("wallpapers", {
    images: {
      "supermoon-over-san-francisco": {
        name: "Supermoon Over San Francisco",
        url: "https://upload.wikimedia.org/wikipedia/commons/b/b4/Supermoon_over_San_Francisco%2C_November_2016.jpg",
        credit: "By Dllu (Own work) [CC BY-SA 4.0 (https://creativecommons.org/licenses/by-sa/4.0)], via Wikimedia Commons",
        creditURL: "https://commons.wikimedia.org/wiki/File%3ASupermoon_over_San_Francisco%2C_November_2016.jpg",
        thumbnail: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Supermoon_over_San_Francisco%2C_November_2016.jpg/640px-Supermoon_over_San_Francisco%2C_November_2016.jpg"
      },
      "san-francisco-ferry-building-dawn": {
        name: "San Francisco Ferry Building at Dawn",
        url: "https://upload.wikimedia.org/wikipedia/commons/6/6c/San_Francisco_Ferry_Building_at_Dawn.jpg",
        credit: "By Brooklyn Peach (Own work) [CC BY-SA 4.0 (https://creativecommons.org/licenses/by-sa/4.0)], via Wikimedia Commons",
        creditURL: "https://commons.wikimedia.org/wiki/File%3ASan_Francisco_Ferry_Building_at_Dawn.jpg",
        thumbnail: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/San_Francisco_Ferry_Building_at_Dawn.jpg/640px-San_Francisco_Ferry_Building_at_Dawn.jpg"
      },
      "san-francisco-skyline": {
        name: "San Francisco Skyline from Coit Tower",
        url: "https://upload.wikimedia.org/wikipedia/commons/6/6a/San_Francisco_skyline_from_Coit_Tower.jpg",
        credit: "By Supercarwaar (Own work) [CC BY-SA 4.0 (https://creativecommons.org/licenses/by-sa/4.0)], via Wikimedia Commons",
        creditURL: "https://commons.wikimedia.org/wiki/File%3ASan_Francisco_skyline_from_Coit_Tower.jpg",
        thumbnail: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/San_Francisco_skyline_from_Coit_Tower.jpg/640px-San_Francisco_skyline_from_Coit_Tower.jpg"
      },
      "san-francisco-sunset": {
        name: "San Francisco (Sunset)",
        url: "https://upload.wikimedia.org/wikipedia/commons/4/43/San_Francisco_%28Sunset%29.jpg",
        credit: "By Basil D Soufi (Own work) [CC BY-SA 3.0 (https://creativecommons.org/licenses/by-sa/3.0)], via Wikimedia Commons",
        creditURL: "https://commons.wikimedia.org/wiki/File%3ASan_Francisco_(Sunset).jpg",
        thumbnail: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/San_Francisco_%28Sunset%29.jpg/1024px-San_Francisco_%28Sunset%29.jpg"
      },
      "shanghai-view": {
        name: "Shanghaiviewpic1",
        url: "https://upload.wikimedia.org/wikipedia/commons/a/ad/Shanghaiviewpic1.jpg",
        credit: "By dawvon (Pudong) [CC BY 2.0 (http://creativecommons.org/licenses/by/2.0)], via Wikimedia Commons",
        creditURL: "https://commons.wikimedia.org/wiki/File%3AShanghaiviewpic1.jpg",
        thumbnail: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Shanghaiviewpic1.jpg/640px-Shanghaiviewpic1.jpg"
      },
      "shanghai-skyline": {
        name: "Shanghai Skyline, Dec 2014",
        url: "https://upload.wikimedia.org/wikipedia/commons/b/b2/Shanghai_Skyline%2C_Dec2014.jpg",
        credit: "By Simon Desmarais [CC BY-SA 2.0 (https://creativecommons.org/licenses/by-sa/2.0)], via Wikimedia Commons",
        creditURL: "https://commons.wikimedia.org/wiki/File%3AShanghai_Skyline%2C_Dec2014.jpg",
        thumbnail: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Shanghai_Skyline%2C_Dec2014.jpg/640px-Shanghai_Skyline%2C_Dec2014.jpg"
      },
      "shanghai-century-park": {
        name: "Shanghai Century Park at Sunset",
        url: "https://upload.wikimedia.org/wikipedia/commons/c/c2/Shanghai_Century_park_at_sunset.jpg",
        credit: "By Mgmoscatello (Own work) [CC BY-SA 3.0 (https://creativecommons.org/licenses/by-sa/3.0)], via Wikimedia Commons",
        creditURL: "https://commons.wikimedia.org/wiki/File%3AShanghai_Century_park_at_sunset.jpg",
        thumbnail: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Shanghai_Century_park_at_sunset.jpg/1024px-Shanghai_Century_park_at_sunset.jpg"
      },
      "dawn-of-shanghai": {
        name: "Dawn of Shanghai",
        url: "https://upload.wikimedia.org/wikipedia/commons/5/5c/Dawn_of_Shanghai.JPG",
        credit: "By Leoyunyi (Own work) [CC BY-SA 4.0 (https://creativecommons.org/licenses/by-sa/4.0)], via Wikimedia Commons",
        creditURL: "https://commons.wikimedia.org/wiki/File%3ADawn_of_Shanghai.JPG",
        thumbnail: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Dawn_of_Shanghai.JPG/640px-Dawn_of_Shanghai.JPG"
      },
      "tahrir-square-early-morning": {
        name: "Tahrir Square, Cairo, in the early morning",
        url: "https://upload.wikimedia.org/wikipedia/commons/7/74/Tahrir_Square%2C_Cairo%2C_in_the_early_morning_-_c.jpg",
        credit: "By Tahrir_Square,_Cairo,_in_the_early_morning.jpg: Frank Schulenburg Derivative work including contrast increase, noise correction and minor changes: Julian Herzog [CC BY-SA 3.0 (https://creativecommons.org/licenses/by-sa/3.0)], via Wikimedia Commons",
        creditURL: "https://commons.wikimedia.org/wiki/File%3ATahrir_Square%2C_Cairo%2C_in_the_early_morning_-_c.jpg",
        thumbnail: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Tahrir_Square%2C_Cairo%2C_in_the_early_morning_-_c.jpg/640px-Tahrir_Square%2C_Cairo%2C_in_the_early_morning_-_c.jpg"
      },
      "view-from-the-cairo": {
        name: "View from The Cairo - facing north",
        url: "https://upload.wikimedia.org/wikipedia/commons/3/3f/View_from_The_Cairo_-_facing_north.jpg",
        credit: "Carol M. Highsmith [Public domain], via Wikimedia Commons",
        creditURL: "https://commons.wikimedia.org/wiki/File%3AView_from_The_Cairo_-_facing_north.jpg",
        thumbnail: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/View_from_The_Cairo_-_facing_north.jpg/640px-View_from_The_Cairo_-_facing_north.jpg"
      },
      "late-evening-in-cairo": {
        name: "Late evening in Cairo",
        url: "https://upload.wikimedia.org/wikipedia/commons/0/08/Late_evening_in_Cairo.jpg",
        credit: "By Frank Schulenburg (Own work) [CC BY-SA 3.0 (https://creativecommons.org/licenses/by-sa/3.0)], via Wikimedia Commons",
        creditURL: "https://commons.wikimedia.org/wiki/File%3ALate_evening_in_Cairo.jpg",
        thumbnail: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Late_evening_in_Cairo.jpg/640px-Late_evening_in_Cairo.jpg"
      },
      "cairo-at-night": {
        name: "Cairo at night",
        url: "https://upload.wikimedia.org/wikipedia/commons/9/91/Cairo_at_night_..jpg",
        credit: "By Maro tharwat (Own work) [CC BY-SA 3.0 (https://creativecommons.org/licenses/by-sa/3.0)], via Wikimedia Commons",
        creditURL: "https://commons.wikimedia.org/wiki/File%3ACairo_at_night_..jpg",
        thumbnail: "https://upload.wikimedia.org/wikipedia/commons/9/91/Cairo_at_night_..jpg"
      },
      "london-from-a-hot-air-balloon": {
        name: "London from a hot air balloon",
        url: "https://upload.wikimedia.org/wikipedia/commons/3/3a/London_from_a_hot_air_balloon.jpg",
        credit: "By Daniel Chapma (Flickr) [CC BY 2.0 (http://creativecommons.org/licenses/by/2.0)], via Wikimedia Commons",
        creditURL: "https://commons.wikimedia.org/wiki/File%3ALondon_from_a_hot_air_balloon.jpg",
        thumbnail: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/London_from_a_hot_air_balloon.jpg/640px-London_from_a_hot_air_balloon.jpg"
      },
      "tower-of-london-white-tower": {
        name: "Tower of London White Tower",
        url: "https://upload.wikimedia.org/wikipedia/commons/f/f0/Tower_of_London_White_Tower.jpg",
        credit: "By Bernard Gagnon (Own work) [GFDL (http://www.gnu.org/copyleft/fdl.html) or CC BY-SA 3.0 (https://creativecommons.org/licenses/by-sa/3.0)], via Wikimedia Commons",
        creditURL: "https://commons.wikimedia.org/wiki/File%3ATower_of_London_White_Tower.jpg",
        thumbnail: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Tower_of_London_White_Tower.jpg/640px-Tower_of_London_White_Tower.jpg"
      },
      "tower-bridge-london-dusk": {
        name: "Tower Bridge London Dusk",
        url: "https://upload.wikimedia.org/wikipedia/commons/5/5f/Tower_Bridge_London_Dusk_Feb_2006.jpg",
        credit: "By Diliff (Own work) [CC BY-SA 3.0 (https://creativecommons.org/licenses/by-sa/3.0) or GFDL (http://www.gnu.org/copyleft/fdl.html)], via Wikimedia Commons",
        creditURL: "https://commons.wikimedia.org/wiki/File%3ATower_Bridge_London_Dusk_Feb_2006.jpg",
        thumbnail: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Tower_Bridge_London_Dusk_Feb_2006.jpg/1024px-Tower_Bridge_London_Dusk_Feb_2006.jpg"
      },
      "london-eye-at-night": {
        name: "London Eye at Night",
        url: "https://upload.wikimedia.org/wikipedia/commons/b/b5/London_Eye_at_night_3.jpg",
        credit: "Photograph by Mike Peel (www.mikepeel.net). [CC BY-SA 4.0 (https://creativecommons.org/licenses/by-sa/4.0)], via Wikimedia Commons",
        creditURL: "https://commons.wikimedia.org/wiki/File%3ALondon_Eye_at_night_3.jpg",
        thumbnail: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/London_Eye_at_night_3.jpg/640px-London_Eye_at_night_3.jpg"
      },
      "sydney-harbour-bridge-dawn": {
        name: "Sydney harbour bridge dawn",
        url: "https://upload.wikimedia.org/wikipedia/commons/4/4d/Sydney_harbour_bridge_dawn.jpg",
        credit: "By Please refer to actuarial disco boy in wikipedia (Own work) [Public domain], via Wikimedia Commons",
        creditURL: "https://commons.wikimedia.org/wiki/File%3ASydney_harbour_bridge_dawn.jpg",
        thumbnail: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Sydney_harbour_bridge_dawn.jpg/640px-Sydney_harbour_bridge_dawn.jpg"
      },
      "sydney-skyline-from-the-north-aerial": {
        name: "Sydney skyline from the north aerial",
        url: "https://upload.wikimedia.org/wikipedia/commons/7/72/Sydney_skyline_from_the_north_aerial_2010.jpg",
        credit: "By Beau Giles (http://www.flickr.com/photos/beaugiles/5245075698) [CC BY 2.0 (http://creativecommons.org/licenses/by/2.0)], via Wikimedia Commons",
        creditURL: "https://commons.wikimedia.org/wiki/File%3ASydney_skyline_from_the_north_aerial_2010.jpg",
        thumbnail: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Sydney_skyline_from_the_north_aerial_2010.jpg/640px-Sydney_skyline_from_the_north_aerial_2010.jpg"
      },
      "sydney-opera-house-sunset": {
        name: "Sydney Opera House Sunset - panoramio",
        url: "https://upload.wikimedia.org/wikipedia/commons/7/76/Sydney_Opera_House_Sunset_-_panoramio.jpg",
        credit: "Danijel James [CC BY 3.0 (http://creativecommons.org/licenses/by/3.0)], via Wikimedia Commons",
        creditURL: "https://commons.wikimedia.org/wiki/File%3ASydney_Opera_House_Sunset_-_panoramio.jpg",
        thumbnail: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Sydney_Opera_House_Sunset_-_panoramio.jpg/640px-Sydney_Opera_House_Sunset_-_panoramio.jpg"
      },
      "sydney-opera-house-night": {
        name: "Sydney Opera House Night",
        url: "https://upload.wikimedia.org/wikipedia/commons/a/a1/Sydney_Opera_House_Night.jpg",
        credit: "By No machine-readable author provided. AnthonyWinning assumed (based on copyright claims). [GFDL (http://www.gnu.org/copyleft/fdl.html), CC-BY-SA-3.0 (http://creativecommons.org/licenses/by-sa/3.0/) or CC BY 2.5 (http://creativecommons.org/licenses/by/2.5)], via Wikimedia Commons",
        creditURL: "https://commons.wikimedia.org/wiki/File%3ASydney_Opera_House_Night.jpg",
        thumbnail: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Sydney_Opera_House_Night.jpg/640px-Sydney_Opera_House_Night.jpg"
      },
      "sao-paulo-congonhas-2": {
        name: "Sao Paulo Congonhas",
        url: "https://upload.wikimedia.org/wikipedia/commons/7/71/Sao_Paulo_Congonhas_2.jpg",
        credit: "By Mariordo (Own work) [CC BY-SA 3.0 (https://creativecommons.org/licenses/by-sa/3.0) or GFDL (http://www.gnu.org/copyleft/fdl.html)], via Wikimedia Commons",
        creditURL: "https://commons.wikimedia.org/wiki/File%3ASao_Paulo_Congonhas_2.jpg",
        thumbnail: "https://upload.wikimedia.org/wikipedia/commons/7/71/Sao_Paulo_Congonhas_2.jpg"
      },
      "paulista-avenue": {
        name: "Paulista Avenue, São Paulo, Brazil",
        url: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Paulista_Avenue%2C_S%C3%A3o_Paulo%2C_Brazil.jpg",
        credit: "By The Photographer (Own work) [CC BY-SA 4.0 (https://creativecommons.org/licenses/by-sa/4.0)], via Wikimedia Commons",
        creditURL: "https://commons.wikimedia.org/wiki/File%3APaulista_Avenue%2C_S%C3%A3o_Paulo%2C_Brazil.jpg",
        thumbnail: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Paulista_Avenue%2C_São_Paulo%2C_Brazil.jpg/597px-Paulista_Avenue%2C_São_Paulo%2C_Brazil.jpg"
      },
      "ponte-estaiada-octavio-frias-sao-paulo": {
        name: "Ponte estaiada Octavio Frias - Sao Paulo",
        url: "https://upload.wikimedia.org/wikipedia/commons/0/0e/Ponte_estaiada_Octavio_Frias_-_Sao_Paulo.jpg",
        credit: "By Marcosleal (Own work) [CC BY-SA 3.0 (https://creativecommons.org/licenses/by-sa/3.0) or GFDL (http://www.gnu.org/copyleft/fdl.html)], via Wikimedia Commons",
        creditURL: "https://commons.wikimedia.org/wiki/File%3APonte_estaiada_Octavio_Frias_-_Sao_Paulo.jpg",
        thumbnail: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Ponte_estaiada_Octavio_Frias_-_Sao_Paulo.jpg/640px-Ponte_estaiada_Octavio_Frias_-_Sao_Paulo.jpg"
      },
      "antarctica-mcmurdo-radarsatunderthemoonatdawn": {
        name: "ARL-USAP-Antarctica-McMurdo-RadarsatUnderTheMoonAtDawn",
        url: "https://upload.wikimedia.org/wikipedia/commons/7/74/ARL-USAP-Antarctica-McMurdo-RadarsatUnderTheMoonAtDawn.JPG",
        credit: "By Alan R Light (Own work) [Public domain], via Wikimedia Commons",
        creditURL: "https://commons.wikimedia.org/wiki/File%3AARL-USAP-Antarctica-McMurdo-RadarsatUnderTheMoonAtDawn.JPG",
        thumbnail: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/ARL-USAP-Antarctica-McMurdo-RadarsatUnderTheMoonAtDawn.JPG/640px-ARL-USAP-Antarctica-McMurdo-RadarsatUnderTheMoonAtDawn.JPG"
      },
      "mount-jackson-antarctica": {
        name: "Mount Jackson, Antarctica",
        url: "https://upload.wikimedia.org/wikipedia/commons/0/0a/Mount_Jackson%2C_Antarctica.jpg",
        credit: "By euphro (Flickr: SE of Mt Jackson ridge) [CC BY-SA 2.0 (https://creativecommons.org/licenses/by-sa/2.0)], via Wikimedia Commons",
        creditURL: "https://commons.wikimedia.org/wiki/File%3AMount_Jackson%2C_Antarctica.jpg",
        thumbnail: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Mount_Jackson%2C_Antarctica.jpg/640px-Mount_Jackson%2C_Antarctica.jpg"
      },
      "antarctica-8381226547": {
        name: "Antarctica (8381226547)",
        url: "https://upload.wikimedia.org/wikipedia/commons/1/1d/Antarctica_%288381226547%29.jpg",
        credit: "Christopher Michel [CC BY 2.0 (http://creativecommons.org/licenses/by/2.0)], via Wikimedia Commons",
        creditURL: "https://commons.wikimedia.org/wiki/File%3AAntarctica_(8381226547).jpg",
        thumbnail: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Antarctica_%288381226547%29.jpg/640px-Antarctica_%288381226547%29.jpg"
      },
      "amundsen-scott": {
        name: "Amundsen-Scott marsstation ray h edit",
        url: "https://upload.wikimedia.org/wikipedia/commons/7/7a/Amundsen-Scott_marsstation_ray_h_edit.jpg",
        credit: "By Photo by Chris Danals, National Science Foundation ([1]) [Public domain], via Wikimedia Commons",
        creditURL: "https://commons.wikimedia.org/wiki/File%3AAmundsen-Scott_marsstation_ray_h_edit.jpg",
        thumbnail: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Amundsen-Scott_marsstation_ray_h_edit.jpg/640px-Amundsen-Scott_marsstation_ray_h_edit.jpg"
      },
      "amazon-rainforest": {
        name: "Amazon Rainforest",
        url: "https://c1.staticflickr.com/7/6091/6285070575_1cfae9eb7d_b.jpg"
      },
      "times-square": {
        name: "Times Square",
        url: "https://upload.wikimedia.org/wikipedia/commons/1/19/Times_Square,_New_York_City_(HDR).jpg",
        credit: "By Francisco Diez from New Jersey, USA (Times Square, NYC) [CC BY 2.0 (http://creativecommons.org/licenses/by/2.0)], via Wikimedia Commons",
        creditURL: "https://commons.wikimedia.org/wiki/File%3ATimes_Square%2C_New_York_City_(HDR).jpg",
        thumbnail: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Times_Square%2C_New_York_City_%28HDR%29.jpg/640px-Times_Square%2C_New_York_City_%28HDR%29.jpg"
      },
      "sushi": {
        name: "Sushi",
        url: "https://upload.wikimedia.org/wikipedia/commons/c/cc/Western_Sushi.jpg"
      },
      "doge": {
        name: "Doge",
        url: "http://vignette1.wikia.nocookie.net/sanicsource/images/9/97/Doge.jpg/revision/latest?cb=20160112233015"
      }
    },
    options: {
      "san-francisco": {
        name: "San Francisco, USA",
        images: {
          dawn: "san-francisco-ferry-building-dawn",
          day: "san-francisco-skyline",
          sunset: "san-francisco-sunset",
          night: "supermoon-over-san-francisco"
        }
      },
      "shanghai": {
        name: "Shanghai, China",
        images: {
          dawn: "dawn-of-shanghai",
          day: "shanghai-skyline",
          sunset: "shanghai-century-park",
          night: "shanghai-view"
        }
      },
      "cairo": {
        name: "Cairo, Egypt",
        images: {
          dawn: "tahrir-square-early-morning",
          day: "view-from-the-cairo",
          sunset: "late-evening-in-cairo",
          night: "cairo-at-night"
        }
      },
      "london": {
        name: "London, UK",
        images: {
          dawn: "london-from-a-hot-air-balloon",
          day: "tower-of-london-white-tower",
          sunset: "tower-bridge-london-dusk",
          night: "london-eye-at-night"
        }
      },
      "sydney": {
        name: "Sydney, Australia",
        images: {
          dawn: "sydney-harbour-bridge-dawn",
          day: "sydney-skyline-from-the-north-aerial",
          sunset: "sydney-opera-house-sunset",
          night: "sydney-opera-house-night"
        }
      },
      "sao-paulo": {
        name: "São Paulo, Brazil",
        images: {
          day: "sao-paulo-congonhas-2",
          sunset: "paulista-avenue",
          night: "ponte-estaiada-octavio-frias-sao-paulo"
        }
      },
      "antarctica": {
        name: "Antarctica",
        images: {
          dawn: "antarctica-mcmurdo-radarsatunderthemoonatdawn",
          day: "mount-jackson-antarctica",
          sunset: "antarctica-8381226547",
          night: "amundsen-scott"
        }
      },
      "amazon-rainforest": true,
      "times-square": true,
      "sushi": true,
      "doge": true
    }
  })
