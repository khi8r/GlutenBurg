# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

# Keep only what is necessary for React Native and Hermes
-keep class com.facebook.hermes.** { *; }
-keep class com.facebook.react.** { *; }
-keep class com.swmansion.** { *; }
-keep class com.airbnb.** { *; }
-keep class expo.** { *; }
-keep class com.facebook.jni.** { *; }
-keep class com.facebook.soloader.** { *; }
-keep class com.facebook.yoga.** { *; }
-keep class com.facebook.proguard.annotations.DoNotStrip { *; }
-keep @com.facebook.proguard.annotations.DoNotStrip class * { *; }
-keep @com.facebook.proguard.annotations.DoNotStrip interface * { *; }
-keepclassmembers class * {
    @com.facebook.proguard.annotations.DoNotStrip *;
}
-dontwarn com.facebook.react.**
-dontwarn com.facebook.hermes.**
-dontwarn com.facebook.soloader.**
-dontwarn com.facebook.yoga.**
-dontwarn com.airbnb.**
-dontwarn expo.**
-dontwarn com.swmansion.**

# Remove logging and debugging information
-assumenosideeffects class android.util.Log {
    public static *** d(...);
    public static *** v(...);
    public static *** i(...);
    public static *** w(...);
    public static *** e(...);
}

# Remove unused code aggressively
-dontnote
-dontoptimize
-dontpreverify
