# Per https://discuss.pixls.us/t/batch-preparing-photo-based-sprites-for-a-2d-food-stop-motion-game/25198/3
currentTime=$(date +%H%M)
mkdir $currentTime
echo Prefix of jpg files? 
read jpgPrefix
for A in $jpgPrefix*.jpg; do 
	simpleFileName=$(basename -s .jpg $A)
	echo simpleFileName is $simpleFileName
	gmic $A fx_extract_foreground 0,0,3,1,2560,1920,1104.31372,1952.62744,1049.09802,439.215698,0,0,2,1 rm[1] display output $currentTime/$simpleFileName.png resize 30,30 output $currentTime/${simpleFileName}_small.png;
done
