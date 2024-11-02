<script setup lang="ts">

import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
</script>

<template>
  <div class="h-full w-full relative">
    <div id="home-bg" class="absolute w-full h-full z-0">
    </div>
    <div class="w-full h-full bg-black opacity-80 absolute z-10"></div>
    <p class="absolute bottom-0 right-0 p-2 z-20 text-muted-foreground">Photo by <a
        href="https://unsplash.com/@sincerelymedia?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Sincerely
      Media</a> on <a
        href="https://unsplash.com/photos/woman-holding-poop-case-XJnjN1eRSEk?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
    </p>
    <div class="z-30 absolute text-foreground w-full h-full flex flex-col lg:flex-row items-center justify-center px-20 gap-10">
      <div class="text-white text-sm lg:text-lg space-y-8 break-words whitespace-break-spaces lg:flex-grow delius-swash-caps-regular">
        <div class="space-y-4">
          <h1 class="text-4xl">Welcome to iPoopedIn 🗺️💩</h1>
          <p class="">Ever wondered where you've made your mark in the world?</p>
          <p>Now you can track and treasure those unforgettable moments with iPoopedIn! Whether you're an avid traveler or just
            want to remember where nature called, this app lets you easily pin every place you’ve done your business.</p>
        </div>

        <div class="space-y-4">
          <h2 class="text-xl">💩 How it works:</h2>
          <ul class="pl-4 list-disc">
            <li>Drop a pin on the map after every drop-off.</li>
            <li>Rate your experience with fun emojis and share a note (if you're feeling inspired).</li>
            <li>Track your stats—see your most frequent locations or find out where you've left your unique stamp.</li>
            <li>Compare with friends and turn your bathroom breaks into the ultimate adventure!</li>
          </ul>
        </div>

        <div class="space-y-4">
          <h2 class="text-xl"> Why? Because why not! 🚽✨</h2>
          <p>Life's about the journey, right? And every journey has its pit stops.</p>
          <p>Join the global community of people who take pride in their business, one flush at a time!</p>
        </div>
      </div>
      <div class="flex-shrink flex items-center">
        <Card class="min-w-[min(500px,100vw)]">
          <CardHeader class="space-y-1">
            <CardTitle class="text-2xl">
              Sign In
            </CardTitle>
            <CardDescription>
              Enter your email below to sign in
            </CardDescription>
          </CardHeader>
          <CardContent class="grid gap-4">
            <div class="grid gap-2">
              <Label for="email">Email</Label>
              <Input id="email" type="email" placeholder="m@example.com"/>
            </div>
            <div class="grid gap-2">
              <Label for="password">Password</Label>
              <Input id="password" type="password"/>
            </div>
          </CardContent>
          <CardFooter>
            <Button class="w-full">
              Create account
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
#home-bg {
  background: url("./images/bg-optimized.jpeg");
  background-position: center center;

}
</style>