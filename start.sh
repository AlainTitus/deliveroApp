# Create a new Expo app
npx create-expo-app@latest cloudApp --template tabs@49


# Install dependencies
npm i @supabase/supabase-js
npm i react-native-url-polyfill base64-arraybuffer react-native-loading-spinner-overlay

# Install Expo packages
npx expo install expo-secure-store
npx expo install expo-image-picker
npx expo install expo-file-system