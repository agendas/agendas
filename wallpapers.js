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
      },
      "eiffel-tower-from-champ-de-mars": {
        name: "Eiffel Tower from Champ-de-Mars, Paris 29 June 2010",
        url: "https://upload.wikimedia.org/wikipedia/commons/0/00/Eiffel_Tower_from_Champ-de-Mars%2C_Paris_29_June_2010.jpg",
        credit: "By Greg Morgan from Oviedo, USA (Europe Vacation 2010 - Paris) [CC BY 2.0 (http://creativecommons.org/licenses/by/2.0)], via Wikimedia Commons",
        creditURL: "https://commons.wikimedia.org/wiki/File%3AEiffel_Tower_from_Champ-de-Mars%2C_Paris_29_June_2010.jpg",
        thumbnail: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Eiffel_Tower_from_Champ-de-Mars%2C_Paris_29_June_2010.jpg/640px-Eiffel_Tower_from_Champ-de-Mars%2C_Paris_29_June_2010.jpg"
      },
      "paris-notre-dame": {
        name: "Paris-Notre-Dame JBU02",
        url: "https://upload.wikimedia.org/wikipedia/commons/b/b4/Paris-Notre-Dame_JBU02.jpg",
        credit: "By Jörg Bittner Unna (Own work) [CC BY-SA 3.0 (https://creativecommons.org/licenses/by-sa/3.0)], via Wikimedia Commons",
        creditURL: "https://commons.wikimedia.org/wiki/File%3AParis-Notre-Dame_JBU02.jpg",
        thumbnail: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Paris-Notre-Dame_JBU02.jpg/640px-Paris-Notre-Dame_JBU02.jpg"
      },
      "paris-sunset-panorama": {
        name: "Paris, sunset panorama from top of Notre Dame cathedral",
        url: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Paris%2C_sunset_panorama_from_top_of_Notre_Dame_cathedral%2C_September_2010.jpg",
        credit: "By Moyan Brenn from Anzio, Italy (Paris) [CC BY 2.0 (http://creativecommons.org/licenses/by/2.0)], via Wikimedia Commons",
        creditURL: "https://commons.wikimedia.org/wiki/File%3AParis%2C_sunset_panorama_from_top_of_Notre_Dame_cathedral%2C_September_2010.jpg",
        thumbnail: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Paris%2C_sunset_panorama_from_top_of_Notre_Dame_cathedral%2C_September_2010.jpg/640px-Paris%2C_sunset_panorama_from_top_of_Notre_Dame_cathedral%2C_September_2010.jpg"
      },
      "musee-dorsay-seine-paris-night": {
        name: "Musée d'Orsay, Seine, Paris, Night",
        url: "https://upload.wikimedia.org/wikipedia/commons/9/96/Mus%C3%A9e_d%27Orsay%2C_Seine%2C_Paris%2C_Night_%2836391326545%29.jpg",
        credit: "By David Baron from San Francisco, California, USA (Musée d'Orsay, Seine, Paris, Night) [CC BY-SA 2.0 (https://creativecommons.org/licenses/by-sa/2.0)], via Wikimedia Commons",
        creditURL: "https://commons.wikimedia.org/wiki/File%3AMus%C3%A9e_d'Orsay%2C_Seine%2C_Paris%2C_Night_(36391326545).jpg",
        thumbnail: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Musée_d%27Orsay%2C_Seine%2C_Paris%2C_Night_%2836391326545%29.jpg/640px-Musée_d%27Orsay%2C_Seine%2C_Paris%2C_Night_%2836391326545%29.jpg"
      },
      "manhattan-new-york-city": {
        name: "Manhattan, New York City",
        url: "https://upload.wikimedia.org/wikipedia/commons/2/29/2Manhattan%2C_New_York_City.jpg",
        credit: "By Ivan2010 (Own work) [CC BY-SA 4.0 (https://creativecommons.org/licenses/by-sa/4.0)], via Wikimedia Commons",
        creditURL: "https://commons.wikimedia.org/wiki/File%3A2Manhattan%2C_New_York_City.jpg",
        thumbnail: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/2Manhattan%2C_New_York_City.jpg/640px-2Manhattan%2C_New_York_City.jpg"
      },
      "queensboro-bridge-new-york": {
        name: "Queensboro Bridge New York",
        url: "https://upload.wikimedia.org/wikipedia/commons/2/2e/Queensboro_Bridge_New_York.jpg",
        credit: "By Lasse Fuss (Own work) [CC BY-SA 3.0 (https://creativecommons.org/licenses/by-sa/3.0)], via Wikimedia Commons",
        creditURL: "https://commons.wikimedia.org/wiki/File%3AQueensboro_Bridge_New_York.jpg",
        thumbnail: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Queensboro_Bridge_New_York.jpg/640px-Queensboro_Bridge_New_York.jpg"
      },
      "sunset-at-nyc": {
        name: "Sunset at NYC",
        url: "https://upload.wikimedia.org/wikipedia/commons/5/52/Sunset_at_NYC.JPG",
        credit: "By Pattybalm (Own work) [CC BY-SA 3.0 (https://creativecommons.org/licenses/by-sa/3.0)], via Wikimedia Commons",
        creditURL: "https://commons.wikimedia.org/wiki/File%3ASunset_at_NYC.JPG",
        thumbnail: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Sunset_at_NYC.JPG/640px-Sunset_at_NYC.JPG"
      },
      "new-york-city-skyline": {
        name: "New York City Skyline + NYC at Night",
        url: "https://upload.wikimedia.org/wikipedia/commons/8/85/New_York_City_Skyline_%2B_NYC_at_Night_-_Kyle_Kirschbaum.JPG",
        credit: "By kyle kirschbaum (Own work) [CC BY-SA 4.0 (https://creativecommons.org/licenses/by-sa/4.0)], via Wikimedia Commons",
        creditURL: "https://commons.wikimedia.org/wiki/File%3ANew_York_City_Skyline_%2B_NYC_at_Night_-_Kyle_Kirschbaum.JPG",
        thumbnail: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/New_York_City_Skyline_%2B_NYC_at_Night_-_Kyle_Kirschbaum.JPG/640px-New_York_City_Skyline_%2B_NYC_at_Night_-_Kyle_Kirschbaum.JPG"
      },
      "vista-del-puerto": {
        name: "Vista del Puerto de Victoria desde Kowloon, Hong Kong",
        url: "https://upload.wikimedia.org/wikipedia/commons/d/d2/Vista_del_Puerto_de_Victoria_desde_Kowloon%2C_Hong_Kong%2C_2013-08-11%2C_DD_17.JPG",
        credit: "Diego Delso [CC BY-SA 3.0 (https://creativecommons.org/licenses/by-sa/3.0)], via Wikimedia Commons",
        creditURL: "https://commons.wikimedia.org/wiki/File%3AVista_del_Puerto_de_Victoria_desde_Kowloon%2C_Hong_Kong%2C_2013-08-11%2C_DD_17.JPG",
        thumbnail: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Vista_del_Puerto_de_Victoria_desde_Kowloon%2C_Hong_Kong%2C_2013-08-11%2C_DD_17.JPG/799px-Vista_del_Puerto_de_Victoria_desde_Kowloon%2C_Hong_Kong%2C_2013-08-11%2C_DD_17.JPG"
      },
      "chinese-sailing-ship": {
        name: "Chinese Sailing Ship Victoria Harbour Kowloon Hong Kong",
        url: "https://upload.wikimedia.org/wikipedia/commons/5/5d/Chinese_Sailing_Ship_Victoria_Harbour_Kowloon_Hong_Kong_-_panoramio.jpg",
        credit: "Hiroki Ogawa [CC BY 3.0 (http://creativecommons.org/licenses/by/3.0)], via Wikimedia Commons",
        creditURL: "https://commons.wikimedia.org/wiki/File%3AChinese_Sailing_Ship_Victoria_Harbour_Kowloon_Hong_Kong_-_panoramio.jpg",
        thumbnail: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Chinese_Sailing_Ship_Victoria_Harbour_Kowloon_Hong_Kong_-_panoramio.jpg/640px-Chinese_Sailing_Ship_Victoria_Harbour_Kowloon_Hong_Kong_-_panoramio.jpg"
      },
      "hong-kong-at-dusk": {
        name: "Hong Kong at Dusk",
        url: "https://upload.wikimedia.org/wikipedia/commons/f/f4/Hong_Kong_at_Dusk_%28SKY-SUNSET%29_I_%281138222273%29.jpg",
        credit: "By Chi King (Hong Kong at Dusk (SKY/SUNSET) I) [CC BY 2.0 (http://creativecommons.org/licenses/by/2.0)], via Wikimedia Commons",
        creditURL: "https://commons.wikimedia.org/wiki/File%3AHong_Kong_at_Dusk_(SKY-SUNSET)_I_(1138222273).jpg",
        thumbnail: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Hong_Kong_at_Dusk_%28SKY-SUNSET%29_I_%281138222273%29.jpg/640px-Hong_Kong_at_Dusk_%28SKY-SUNSET%29_I_%281138222273%29.jpg"
      },
      "hong-kong-unsplash": {
        name: "Hong Kong (Unsplash pZFOGkYX Dc)",
        url: "https://upload.wikimedia.org/wikipedia/commons/b/b2/Hong_Kong_%28Unsplash_pZFOGkYX_Dc%29.jpg",
        credit: "By Mark Goh markgohlie (https://unsplash.com/photos/pZFOGkYX_Dc) [CC0], via Wikimedia Commons",
        creditURL: "https://commons.wikimedia.org/wiki/File%3AHong_Kong_(Unsplash_pZFOGkYX_Dc).jpg",
        thumbnail: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Hong_Kong_%28Unsplash_pZFOGkYX_Dc%29.jpg/640px-Hong_Kong_%28Unsplash_pZFOGkYX_Dc%29.jpg"
      },
      "fuente-de-la-plaza": {
        name: "Fuente de la plaza central de San Juan de los Lagos",
        url: "https://upload.wikimedia.org/wikipedia/commons/b/bd/Fuente_de_la_plaza_central_de_San_Juan_de_los_Lagos_01.JPG",
        credit: "By Luisalvaz (Own work) [CC BY-SA 4.0 (https://creativecommons.org/licenses/by-sa/4.0)], via Wikimedia Commons",
        creditURL: "https://commons.wikimedia.org/wiki/File%3AFuente_de_la_plaza_central_de_San_Juan_de_los_Lagos_01.JPG",
        thumbnail: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Fuente_de_la_plaza_central_de_San_Juan_de_los_Lagos_01.JPG/360px-Fuente_de_la_plaza_central_de_San_Juan_de_los_Lagos_01.JPG"
      },
      "lagos-sunset": {
        name: "Lagos 20170808-065317-P8080160",
        url: "https://upload.wikimedia.org/wikipedia/commons/9/90/Lagos_20170808-065317-P8080160_%2835686327004%29.jpg",
        credit: "By Martin Robson from Brighton, UK (20170808-065317-P8080160) [CC BY-SA 2.0 (https://creativecommons.org/licenses/by-sa/2.0)], via Wikimedia Commons",
        creditURL: "https://commons.wikimedia.org/wiki/File%3ALagos_20170808-065317-P8080160_(35686327004).jpg",
        thumbnail: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Lagos_20170808-065317-P8080160_%2835686327004%29.jpg/640px-Lagos_20170808-065317-P8080160_%2835686327004%29.jpg"
      },
      "cidade-e-concelho": {
        name: "Cidade e concelho de Lagos, Portugal MG 9308",
        url: "https://upload.wikimedia.org/wikipedia/commons/8/85/Cidade_e_concelho_de_Lagos%2C_Portugal_MG_9308_%2815251412416%29.jpg",
        credit: "By Tibor Kovacs (_MG_9308.jpg) [CC BY 2.0 (http://creativecommons.org/licenses/by/2.0)], via Wikimedia Commons",
        creditURL: "https://commons.wikimedia.org/wiki/File%3ACidade_e_concelho_de_Lagos%2C_Portugal_MG_9308_(15251412416).jpg",
        thumbnail: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Cidade_e_concelho_de_Lagos%2C_Portugal_MG_9308_%2815251412416%29.jpg/640px-Cidade_e_concelho_de_Lagos%2C_Portugal_MG_9308_%2815251412416%29.jpg"
      },
      "market-lagos-nigeria": {
        name: "2010 market Lagos Nigeria",
        url: "https://upload.wikimedia.org/wikipedia/commons/8/85/2010_market_Lagos_Nigeria_4577295552.jpg",
        credit: "By satanoid from Austin, TX, USA (IMG_0535) [CC BY 2.0 (http://creativecommons.org/licenses/by/2.0)], via Wikimedia Commons",
        creditURL: "https://commons.wikimedia.org/wiki/File%3A2010_market_Lagos_Nigeria_4577295552.jpg",
        thumbnail: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/2010_market_Lagos_Nigeria_4577295552.jpg/800px-2010_market_Lagos_Nigeria_4577295552.jpg"
      },
      "melbourne-city-view": {
        name: "Melbourne City View",
        url: "https://upload.wikimedia.org/wikipedia/commons/9/9f/Melbourne_City_View.jpg",
        credit: "By Tinghao Wang (Own work) [CC BY-SA 4.0 (https://creativecommons.org/licenses/by-sa/4.0)], via Wikimedia Commons",
        creditURL: "https://commons.wikimedia.org/wiki/File%3AMelbourne_City_View.jpg",
        thumbnail: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Melbourne_City_View.jpg/640px-Melbourne_City_View.jpg"
      },
      "melbourne-by-night": {
        name: "Melbourne by Night - panoramio",
        url: "https://upload.wikimedia.org/wikipedia/commons/8/8e/Melbourne_by_Night_-_panoramio.jpg",
        credit: "François Philipp [CC BY-SA 3.0 (https://creativecommons.org/licenses/by-sa/3.0)], via Wikimedia Commons",
        creditURL: "https://commons.wikimedia.org/wiki/File%3AMelbourne_by_Night_-_panoramio.jpg",
        thumbnail: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Melbourne_by_Night_-_panoramio.jpg/640px-Melbourne_by_Night_-_panoramio.jpg"
      },
      "summer-sunrise-melbourne": {
        name: "Summer sunrise (Melbourne, Australia)",
        url: "https://upload.wikimedia.org/wikipedia/commons/7/78/Summer_sunrise_%28Melbourne%2C_Australia%29.jpg",
        credit: "By Steve Davidson [CC BY 2.0 (http://creativecommons.org/licenses/by/2.0)], via Wikimedia Commons",
        creditURL: "https://commons.wikimedia.org/wiki/File%3ASummer_sunrise_(Melbourne%2C_Australia).jpg",
        thumbnail: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Summer_sunrise_%28Melbourne%2C_Australia%29.jpg/640px-Summer_sunrise_%28Melbourne%2C_Australia%29.jpg"
      },
      "melbournesunset": {
        name: "Melbournesunset",
        url: "https://upload.wikimedia.org/wikipedia/commons/7/7a/Melbournesunset.JPG",
        credit: "By MDRX (Own work) [CC BY-SA 3.0 (https://creativecommons.org/licenses/by-sa/3.0)], via Wikimedia Commons",
        creditURL: "https://commons.wikimedia.org/wiki/File%3AMelbournesunset.JPG",
        thumbnail: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Melbournesunset.JPG/640px-Melbournesunset.JPG"
      },
      "time-lapse-of-night-sky": {
        name: "Time-lapse of night sky in Antarctica",
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Time-lapse_of_night_sky_in_Antarctica.webm/1920px--Time-lapse_of_night_sky_in_Antarctica.webm.jpg",
        creditURL: "https://commons.wikimedia.org/wiki/File:Time-lapse_of_night_sky_in_Antarctica.webm",
        thumbnail: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Time-lapse_of_night_sky_in_Antarctica.webm/800px--Time-lapse_of_night_sky_in_Antarctica.webm.jpg"
      },
      "antarctica-sailing-trip": {
        name: "Antarctica Sailing Trip",
        url: "https://upload.wikimedia.org/wikipedia/commons/3/35/Antarctica_Sailing_Trip_%283253678755%29.jpg",
        credit: "By 23am.com (Antarctica Sailing Trip) [CC BY 2.0 (http://creativecommons.org/licenses/by/2.0)], via Wikimedia Commons",
        creditURL: "https://commons.wikimedia.org/wiki/File%3AAntarctica_Sailing_Trip_(3253678755).jpg",
        thumbnail: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Antarctica_Sailing_Trip_%283253678755%29.jpg/640px-Antarctica_Sailing_Trip_%283253678755%29.jpg"
      },
      "antarctica-laubeuf-fjord": {
        name: "Antarctica (7), Laubeuf Fjord, Webb Island",
        url: "https://upload.wikimedia.org/wikipedia/commons/e/e8/Antarctica_%287%29%2C_Laubeuf_Fjord%2C_Webb_Island.JPG",
        credit: "By Vincent van Zeijst (Own work) [CC BY-SA 3.0 (https://creativecommons.org/licenses/by-sa/3.0)], via Wikimedia Commons",
        creditURL: "https://commons.wikimedia.org/wiki/File%3AAntarctica_(7)%2C_Laubeuf_Fjord%2C_Webb_Island.JPG",
        thumbnail: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Antarctica_%287%29%2C_Laubeuf_Fjord%2C_Webb_Island.JPG/640px-Antarctica_%287%29%2C_Laubeuf_Fjord%2C_Webb_Island.JPG"
      },
      "antarctic-light": {
        name: "Antarctic-light 066 hg",
        url: "https://upload.wikimedia.org/wikipedia/commons/a/aa/Antarctic-light_066_hg.jpg",
        credit: "By Hannes Grobe/AWI (Own work) [CC BY 3.0 (http://creativecommons.org/licenses/by/3.0)], via Wikimedia Commons",
        creditURL: "https://commons.wikimedia.org/wiki/File%3AAntarctic-light_066_hg.jpg",
        thumbnail: "https://commons.wikimedia.org/wiki/File%3AAntarctic-light_066_hg.jpg"
      },
      "sugar-loaf-from-cristo": {
        name: "Sugar loaf from Cristo Redentor",
        url: "https://upload.wikimedia.org/wikipedia/commons/b/b6/Sugar_loaf_from_Cristo_Redentor_2010.JPG",
        credit: "By chensiyuan (chensiyuan) [GFDL (http://www.gnu.org/copyleft/fdl.html) or CC BY-SA 4.0-3.0-2.5-2.0-1.0 (https://creativecommons.org/licenses/by-sa/4.0-3.0-2.5-2.0-1.0)], via Wikimedia Commons",
        creditURL: "https://commons.wikimedia.org/wiki/File%3ASugar_loaf_from_Cristo_Redentor_2010.JPG",
        thumbnail: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Sugar_loaf_from_Cristo_Redentor_2010.JPG/640px-Sugar_loaf_from_Cristo_Redentor_2010.JPG"
      },
      "rio-de-janeiro-at-night": {
        name: "Rio de Janeiro at night",
        url: "https://upload.wikimedia.org/wikipedia/commons/7/76/Rio_de_Janeiro_at_night.jpg",
        credit: "By Lima Andruška from Rio de Janeiro, Brazil (Rio de Janeiro's skyline) [CC BY-SA 2.0 (https://creativecommons.org/licenses/by-sa/2.0)], via Wikimedia Commons",
        creditURL: "https://commons.wikimedia.org/wiki/File%3ARio_de_Janeiro_at_night.jpg",
        thumbnail: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Rio_de_Janeiro_at_night.jpg/640px-Rio_de_Janeiro_at_night.jpg"
      },
      "rio-de-janeiro": {
        name: "Rio De Janeiro - Rafael Defavari",
        url: "https://upload.wikimedia.org/wikipedia/commons/1/1e/Rio_De_Janeiro_-_Rafael_Defavari.jpg",
        credit: "By Rafael Defavari (Own work) [CC BY-SA 4.0 (https://creativecommons.org/licenses/by-sa/4.0)], via Wikimedia Commons",
        creditURL: "https://commons.wikimedia.org/wiki/File%3ARio_De_Janeiro_-_Rafael_Defavari.jpg",
        thumbnail: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Rio_De_Janeiro_-_Rafael_Defavari.jpg/800px-Rio_De_Janeiro_-_Rafael_Defavari.jpg"
      },
      "vegetacao-no-parque": {
        name: "Vegetação no Parque Lage, Rio de Janeiro",
        url: "https://upload.wikimedia.org/wikipedia/commons/e/ef/Vegeta%C3%A7%C3%A3o_no_Parque_Lage%2C_Rio_de_Janeiro-RJ.jpg",
        credit: "By Willemarcel (Own work) [CC BY-SA 3.0 (https://creativecommons.org/licenses/by-sa/3.0)], via Wikimedia Commons",
        creditURL: "https://commons.wikimedia.org/wiki/File%3AVegeta%C3%A7%C3%A3o_no_Parque_Lage%2C_Rio_de_Janeiro-RJ.jpg",
        thumbnail: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Vegetação_no_Parque_Lage%2C_Rio_de_Janeiro-RJ.jpg/640px-Vegetação_no_Parque_Lage%2C_Rio_de_Janeiro-RJ.jpg"
      }
    },
    options: {
      "new-york": {
        name: "New York, USA",
        images: {
          dawn: "queensboro-bridge-new-york",
          day: "manhattan-new-york-city",
          sunset: "sunset-at-nyc",
          night: "new-york-city-skyline"
        }
      },
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
      "hong-kong": {
        name: "Hong Kong",
        images: {
          dawn: "hong-kong-unsplash",
          day: "chinese-sailing-ship",
          sunset: "hong-kong-at-dusk",
          night: "vista-del-puerto"
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
      "lagos": {
        name: "Lagos, Nigeria",
        images: {
          dawn: "market-lagos-nigeria",
          day: "fuente-de-la-plaza",
          sunset: "lagos-sunset",
          night: "cidade-e-concelho"
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
      "paris": {
        name: "Paris, France",
        images: {
          dawn: "paris-notre-dame",
          day: "eiffel-tower-from-champ-de-mars",
          sunset: "paris-sunset-panorama",
          night: "musee-dorsay-seine-paris-night"
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
      "melbourne": {
        name: "Melbourne, Australia",
        images: {
          dawn: "summer-sunrise-melbourne",
          day: "melbourne-city-view",
          sunset: "melbournesunset",
          night: "melbourne-by-night"
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
      "rio": {
        name: "Rio de Janeiro, Brazil",
        images: {
          dawn: "vegetacao-no-parque",
          day: "sugar-loaf-from-cristo",
          sunset: "rio-de-janeiro-at-night",
          night: "rio-de-janeiro"
        }
      },
      "antarctica": {
        name: "Antarctica 1",
        images: {
          dawn: "antarctica-mcmurdo-radarsatunderthemoonatdawn",
          day: "mount-jackson-antarctica",
          sunset: "antarctica-8381226547",
          night: "amundsen-scott"
        }
      },
      "antarctica-2": {
        name: "Antarctica 2",
        images: {
          dawn: "antarctica-sailing-trip",
          day: "antarctica-laubeuf-fjord",
          sunset: "antarctic-light",
          night: "time-lapse-of-night-sky"
        }
      },
      "amazon-rainforest": true,
      "times-square": true,
      "sushi": true,
      "doge": true
    }
  })
