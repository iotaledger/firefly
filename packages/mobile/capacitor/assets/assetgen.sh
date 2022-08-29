#!/bin/sh
base_dark="capacitor/assets/dark/$1"
base_light="capacitor/assets/light/$1"
dest_ios="ios/App/App/Assets.xcassets/AppIcon.appiconset"
dest_ios_splash="ios/App/App/Assets.xcassets/Splash.imageset"
dest_android="android/app/src/main/res"
# http://astroa.physics.metu.edu.tr/MANUALS/ImageMagick-6.2.5/www/command-line-options.html#filter
# we use filter and support to get smooth
icon_opts="-filter Gaussian -support 7.5 -background white"
  
if [ -z $1 ]
  then
    echo No argument given
else
  ## iOS files 
  convert "$base_light" $icon_opts -resize 20x20!         "$dest_ios/AppIcon-20x20@1x.png"
  convert "$base_light" $icon_opts -resize 40x40!         "$dest_ios/AppIcon-20x20@2x.png"
  convert "$base_light" $icon_opts -resize 40x40!         "$dest_ios/AppIcon-20x20@2x-1.png"
  convert "$base_light" $icon_opts -resize 60x60!         "$dest_ios/AppIcon-20x20@3x.png"
  convert "$base_light" $icon_opts -resize 29x29!         "$dest_ios/AppIcon-29x29@1x.png"
  convert "$base_light" $icon_opts -resize 58x58!         "$dest_ios/AppIcon-29x29@2x.png"
  convert "$base_light" $icon_opts -resize 58x58!         "$dest_ios/AppIcon-29x29@2x-1.png"
  convert "$base_light" $icon_opts -resize 87x87!         "$dest_ios/AppIcon-29x29@3x.png"
  convert "$base_light" $icon_opts -resize 40x40!         "$dest_ios/AppIcon-40x40@1x.png"
  convert "$base_light" $icon_opts -resize 80x80!         "$dest_ios/AppIcon-40x40@2x.png"
  convert "$base_light" $icon_opts -resize 80x80!         "$dest_ios/AppIcon-40x40@2x-1.png"
  convert "$base_light" $icon_opts -resize 120x120!       "$dest_ios/AppIcon-40x40@3x.png"
  convert "$base_light" $icon_opts -resize 120x120!       "$dest_ios/AppIcon-60x60@2x.png"
  convert "$base_light" $icon_opts -resize 180x180!       "$dest_ios/AppIcon-60x60@3x.png"
  convert "$base_light" $icon_opts -resize 76x76!         "$dest_ios/AppIcon-76x76@1x.png"
  convert "$base_light" $icon_opts -resize 152x152!       "$dest_ios/AppIcon-76x76@2x.png"
  convert "$base_light" $icon_opts -resize 167x167!       "$dest_ios/AppIcon-83.5x83.5@2x.png"
  convert "$base_light" $icon_opts -resize 1024x1024!     "$dest_ios/AppIcon-512@2x.png"
  
  ## Android files
  ### Ensure needed directories exist
  mkdir -p "$dest_android/mipmap-mdpi"
  mkdir -p "$dest_android/mipmap-hdpi"
  mkdir -p "$dest_android/mipmap-xhdpi"
  mkdir -p "$dest_android/mipmap-xxhdpi"
  mkdir -p "$dest_android/mipmap-xxxhdpi"
  mkdir -p "$dest_android/drawable"
  mkdir -p "$dest_android/drawable-port-mdpi"
  mkdir -p "$dest_android/drawable-port-hdpi"
  mkdir -p "$dest_android/drawable-port-xhdpi"
  mkdir -p "$dest_android/drawable-port-xxhdpi"
  mkdir -p "$dest_android/drawable-port-xxxhdpi"
  
  ### Add margin for adaptive icons
  add_margin="-background white -gravity center -scale 248x248 -extent 384x384"
  
  ## -adaptive-blur 1,1
  
  convert "$base_light" $icon_opts -resize 48x48!                   "$dest_android/mipmap-mdpi/ic_launcher.png"
  convert "$base_light" $icon_opts -resize 108x108!   $add_margin   "$dest_android/mipmap-mdpi/ic_launcher_foreground.png"
  convert "$base_light" $icon_opts -resize 48x48!                   "$dest_android/mipmap-mdpi/ic_launcher_round.png"
  convert "$base_light" $icon_opts -resize 72x72!                   "$dest_android/mipmap-hdpi/ic_launcher.png"
  convert "$base_light" $icon_opts -resize 162x162!   $add_margin   "$dest_android/mipmap-hdpi/ic_launcher_foreground.png"
  convert "$base_light" $icon_opts -resize 72x72!                   "$dest_android/mipmap-hdpi/ic_launcher_round.png"
  convert "$base_light" $icon_opts -resize 96x96!                   "$dest_android/mipmap-xhdpi/ic_launcher.png"
  convert "$base_light" $icon_opts -resize 216x216!   $add_margin   "$dest_android/mipmap-xhdpi/ic_launcher_foreground.png"
  convert "$base_light" $icon_opts -resize 96x96!                   "$dest_android/mipmap-xhdpi/ic_launcher_round.png"
  convert "$base_light" $icon_opts -resize 144x144!                 "$dest_android/mipmap-xxhdpi/ic_launcher.png"
  convert "$base_light" $icon_opts -resize 324x324!   $add_margin   "$dest_android/mipmap-xxhdpi/ic_launcher_foreground.png"
  convert "$base_light" $icon_opts -resize 144x144!                 "$dest_android/mipmap-xxhdpi/ic_launcher_round.png"
  convert "$base_light" $icon_opts -resize 192x192!                 "$dest_android/mipmap-xxxhdpi/ic_launcher.png"
  convert "$base_light" $icon_opts -resize 432x432!   $add_margin   "$dest_android/mipmap-xxxhdpi/ic_launcher_foreground.png"
  convert "$base_light" $icon_opts -resize 192x192!                 "$dest_android/mipmap-xxxhdpi/ic_launcher_round.png"

  ## Launch screen
  ### Add margin for center logo
  add_margin="-background #1B2D4B -gravity center -scale 256x256 -extent 660x2420"

  ### Add Android options to create a 9.png
  border_color="black"
  topside_left="line 1,0 101,0"
  topside_right="line 500,0 600,0"
  leftside_top="line 0,1 0,501"
  leftside_bottom="line 0,1100 0,1600"
  background_color="#1B2D4B"
  ios_splash_opts="-filter Gaussian -support 7.5 -background $background_color"
  android_splash_opts="-fuzz 30% -background $background_color -gravity center -extent 600x1600 -matte -bordercolor none -border 1 -fill $border_color"

  ## iOS
  convert "$base_dark" $ios_splash_opts -resize 2732x2732!   $add_margin  "$dest_ios_splash/splash-2732x2732.png"
  convert "$base_dark" $ios_splash_opts -resize 2732x2732!   $add_margin  "$dest_ios_splash/splash-2732x2732-1.png"
  convert "$base_dark" $ios_splash_opts -resize 2732x2732!   $add_margin  "$dest_ios_splash/splash-2732x2732-2.png"
  
  ## Android
  convert "$base_dark" -resize 96x96! $android_splash_opts -draw "$leftside_top" -draw "$leftside_bottom" -draw "$topside_left" -draw "$topside_right" "$dest_android/drawable/splash.9.png"
  convert "$base_dark" -resize 96x96! $android_splash_opts -draw "$leftside_top" -draw "$leftside_bottom" -draw "$topside_left" -draw "$topside_right" "$dest_android/drawable-port-mdpi/splash.9.png"
  convert "$base_dark" -resize 256x256! $android_splash_opts -draw "$leftside_top" -draw "$leftside_bottom" -draw "$topside_left" -draw "$topside_right" "$dest_android/drawable-port-hdpi/splash.9.png"
  convert "$base_dark" -resize 256x256! $android_splash_opts -draw "$leftside_top" -draw "$leftside_bottom" -draw "$topside_left" -draw "$topside_right" "$dest_android/drawable-port-xhdpi/splash.9.png"
  convert "$base_dark" -resize 256x256! $android_splash_opts -draw "$leftside_top" -draw "$leftside_bottom" -draw "$topside_left" -draw "$topside_right" "$dest_android/drawable-port-xxhdpi/splash.9.png"
  convert "$base_dark" -resize 512x512! $android_splash_opts -draw "$leftside_top" -draw "$leftside_bottom" -draw "$topside_left" -draw "$topside_right" "$dest_android/drawable-port-xxxhdpi/splash.9.png"
fi
