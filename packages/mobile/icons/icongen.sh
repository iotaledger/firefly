#!/bin/sh
base=$1
dest_ios="ios/App/App/Assets.xcassets/AppIcon.appiconset"
dest_android="android/app/src/main/res"

if [ -z $base ]
  then
    echo No argument given
else
  
  ## iOS files
  convert "$base" -resize 20x20!         "$dest_ios/AppIcon-20x20@1x.png"
  convert "$base" -resize 40x40!         "$dest_ios/AppIcon-20x20@2x.png"
  convert "$base" -resize 40x40!         "$dest_ios/AppIcon-20x20@2x-1.png"
  convert "$base" -resize 60x60!         "$dest_ios/AppIcon-20x20@3x.png"
  convert "$base" -resize 29x29!         "$dest_ios/AppIcon-29x29@1x.png"
  convert "$base" -resize 58x58!         "$dest_ios/AppIcon-29x29@2x.png"
  convert "$base" -resize 58x58!         "$dest_ios/AppIcon-29x29@2x-1.png"
  convert "$base" -resize 87x87!         "$dest_ios/AppIcon-29x29@3x.png"
  convert "$base" -resize 40x40!         "$dest_ios/AppIcon-40x40@1x.png"
  convert "$base" -resize 80x80!         "$dest_ios/AppIcon-40x40@2x.png"
  convert "$base" -resize 80x80!         "$dest_ios/AppIcon-40x40@2x-1.png"
  convert "$base" -resize 120x120!       "$dest_ios/AppIcon-40x40@3x.png"
  convert "$base" -resize 120x120!       "$dest_ios/AppIcon-60x60@2x.png"
  convert "$base" -resize 180x180!       "$dest_ios/AppIcon-60x60@3x.png"
  convert "$base" -resize 76x76!         "$dest_ios/AppIcon-76x76@1x.png"
  convert "$base" -resize 152x152!       "$dest_ios/AppIcon-76x76@2x.png"
  convert "$base" -resize 167x167!       "$dest_ios/AppIcon-83.5x83.5@2x.png"
  convert "$base" -resize 1024x1024!     "$dest_ios/AppIcon-512@2x.png"
  
  ## Android files
  ### Ensure needed directories exist
  mkdir -p "$dest_android/mipmap-mdpi"
  mkdir -p "$dest_android/mipmap-hdpi"
  mkdir -p "$dest_android/mipmap-xhdpi"
  mkdir -p "$dest_android/mipmap-xxhdpi"
  mkdir -p "$dest_android/mipmap-xxxhdpi"
  ### Add margin for adaptive icons
  add_margin="-background none -gravity center -scale 96x96 -extent 165x165"
  convert "$base" -resize 48x48!                   "$dest_android/mipmap-mdpi/ic_launcher.png"
  convert "$base" -resize 108x108!   $add_margin   "$dest_android/mipmap-mdpi/ic_launcher_foreground.png"
  convert "$base" -resize 48x48!                   "$dest_android/mipmap-mdpi/ic_launcher_round.png"
  convert "$base" -resize 72x72!                   "$dest_android/mipmap-hdpi/ic_launcher.png"
  convert "$base" -resize 162x162!   $add_margin   "$dest_android/mipmap-hdpi/ic_launcher_foreground.png"
  convert "$base" -resize 72x72!                   "$dest_android/mipmap-hdpi/ic_launcher_round.png"
  convert "$base" -resize 96x96!                   "$dest_android/mipmap-xhdpi/ic_launcher.png"
  convert "$base" -resize 216x216!   $add_margin   "$dest_android/mipmap-xhdpi/ic_launcher_foreground.png"
  convert "$base" -resize 96x96!                   "$dest_android/mipmap-xhdpi/ic_launcher_round.png"
  convert "$base" -resize 144x144!                 "$dest_android/mipmap-xxhdpi/ic_launcher.png"
  convert "$base" -resize 324x324!   $add_margin   "$dest_android/mipmap-xxhdpi/ic_launcher_foreground.png"
  convert "$base" -resize 144x144!                 "$dest_android/mipmap-xxhdpi/ic_launcher_round.png"
  convert "$base" -resize 192x192!                 "$dest_android/mipmap-xxxhdpi/ic_launcher.png"
  convert "$base" -resize 432x432!   $add_margin   "$dest_android/mipmap-xxxhdpi/ic_launcher_foreground.png"
  convert "$base" -resize 192x192!                 "$dest_android/mipmap-xxxhdpi/ic_launcher_round.png"
fi
