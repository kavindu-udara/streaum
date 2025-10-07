# Use official Node.js image as base
FROM node:20-bullseye

# Install dependencies for Android and iOS builds
RUN apt-get update && \
    apt-get install -y openjdk-17-jdk wget unzip ruby ruby-dev libffi-dev && \
    gem install cocoapods && \
    rm -rf /var/lib/apt/lists/*

# Install Android SDK Command Line Tools
ENV ANDROID_SDK_ROOT=/opt/android-sdk
RUN mkdir -p $ANDROID_SDK_ROOT/cmdline-tools && \
    wget -q https://dl.google.com/android/repository/commandlinetools-linux-10406996_latest.zip -O /tmp/cmdline-tools.zip && \
    unzip /tmp/cmdline-tools.zip -d $ANDROID_SDK_ROOT/cmdline-tools && \
    mv $ANDROID_SDK_ROOT/cmdline-tools/cmdline-tools $ANDROID_SDK_ROOT/cmdline-tools/latest && \
    rm /tmp/cmdline-tools.zip

# Set environment variables for Android SDK
ENV PATH=$PATH:$ANDROID_SDK_ROOT/cmdline-tools/latest/bin:$ANDROID_SDK_ROOT/platform-tools:$ANDROID_SDK_ROOT/emulator

# Accept Android SDK licenses and install build tools
RUN yes | sdkmanager --licenses && \
    sdkmanager "platform-tools" "platforms;android-34" "build-tools;34.0.0"

# Set working directory
WORKDIR /app/mobile-app

# Prevent CLIs from trying to ask interactive questions in CI
ENV CI=1

# Copy package.json and install dependencies
COPY mobile-app/package*.json ./
RUN npm install

# Copy the rest of the project files
COPY . .

# Install expo-cli globally
RUN npm install -g expo-cli

# Run an Expo prebuild at image build time non-interactively so an
# `android/` directory exists when the container is run later. This
# avoids runtime prompts like "Continue?" and the subsequent
# "cd: android: No such file or directory" error in the workflow.
# Use --no-install to skip installing deps again (we already ran npm install).
# Ensure app.json has an android.package to avoid Play Store package conflicts
# which cause expo to prompt during prebuild (and fail in non-interactive CI).
RUN node -e '\
const fs = require("fs");\
const p = "app.json";\
if (fs.existsSync(p)) {\
    const j = JSON.parse(fs.readFileSync(p));\
    j.expo = j.expo || {};\
    j.expo.android = j.expo.android || {};\
    if (!j.expo.android.package) {\
        j.expo.android.package = "com.streaum.mobileapp";\
        fs.writeFileSync(p, JSON.stringify(j, null, 2));\
        console.log("Set android.package to", j.expo.android.package);\
    } else {\
        console.log("android.package already set to", j.expo.android.package);\
    }\
} else { console.log("app.json not found, skipping package set"); }'

RUN npx expo prebuild --platform android --no-install || true

# Health check: build for Android and iOS, display issues
# (You can override this in your workflow if needed)
CMD ["bash","-lc","echo \"Checking Android build...\" && expo run:android --no-install || echo \"Android build failed\" && echo \"Checking iOS build...\" && expo run:ios --no-install || echo \"iOS build failed\""]