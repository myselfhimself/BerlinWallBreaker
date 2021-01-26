# From https://github.com/komoot/staticmap#show-icon-marker
# From https://towardsdatascience.com/geocode-with-python-161ec1e62b89
# Adding G'MIC filter from https://gmic.eu/gallery/stylization.shtml#menu
from staticmap import StaticMap, IconMarker
import gmic
from geopy import Nominatim

def make_map(filename_without_ext, addresses, gmic_effect="fx_freaky_bw 90,20,0,0,0,0", no_display=False, prefix="LETTER"):
    m = StaticMap(800, 600, 80)
    g = gmic.Gmic("update")
    locator = Nominatim(user_agent="BerlinWallBreaker Agent")
    print("geocoding..")
    for address in addresses:
        loc = locator.geocode(address)
        icon_flag = IconMarker((loc.longitude, loc.latitude), './samples/icon-flag.png', 12, 32)
        m.add_marker(icon_flag)
        print(loc)
    
    image = m.render()
    output_filename1 = prefix + filename_without_ext + "_original.png"
    output_filename2 = prefix + filename_without_ext + ".png"
    image.save(output_filename1)
    print(output_filename1)
    if not no_display:
        g.run(output_filename1 + " display")
    if "_fx_stylize" in gmic_effect:
        gmic.run(output_filename1 + " " + gmic_effect + " output[2] " + output_filename2 +  (" display[2]" if not no_display else "")) 
    else:
        gmic.run(output_filename1 + " " + gmic_effect + " output " + output_filename2 +  (" display" if not no_display else "")) 
    print(output_filename2)

    return output_filename1, output_filename2


effectA = "_fx_stylize landscapenearantwerp +fx_stylize 1,6,0,0,2.17,3.65,3,0.5,0.1,3,3,0,0.7,1,0,1,0,5,5,7,1,30,10,2,1.85,0"
effectB = "_fx_stylize redwaistcoat +fx_stylize 1,4,0,0,0.67,3.17,3,0.5,0.06,3,3,0,0.7,5,0,2,0,5,5,7,1,30,0,2.05,1.85,0"
effectC = "_fx_stylize starrynight +fx_stylize 1,6,0,0,0.5,2,3,0.5,0.1,3,3,0,0.7,1,0,1,0,5,5,7,1,30,10,2,1.85,0"
effectD = "fx_engrave 0.5,50,0,8,40,0,0,0,10,1,0,0,0,1,0"
effectE = "fx_freaky_bw 90,20,0,0,0,0"
levels = []
levels.append(['praha', ['karlovo namesti praha', 'vladislavova 11 praha', 'pivovar narodni praha', 'letna park praha', 'microsoft praha', 'waldstein garden, prague'], effectE])
# levels.append(['level2', ['Praha, Cesko', 'Riviere du Loup, Quebec, Canada'], effectE])
# levels.append(['level3', ['Caen, France', 'Le Havre, France'], effectE])

result_filenames = "" 
for a in levels:
    a.append(True) # toggle no_display parameter
    result_filenames += " ".join(make_map(*a)) + " "

gmic.run(result_filenames + "display")
