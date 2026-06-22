import { useEffect, useRef, useState } from "react";
import heroBg from "assets/back.webp";
import heroBuilding from "assets/house.webp";
import heroCloud from "assets/cloud.webp";
import heroCloudScroll from "assets/smoke.webp";

const PARMAR_PATHS = [
  "M 302.06 11.66 L 302.06 55.22 Q 302.06 59.4 302.72 61.27 Q 303.38 63.14 305.195 63.8 Q 307.01 64.46 310.97 64.68 L 310.97 66.88 Q 304.59 66.55 292.6 66.55 Q 277.75 66.55 270.82 66.88 L 270.82 64.68 Q 274.78 64.46 276.595 63.8 Q 278.41 63.14 279.07 61.27 Q 279.73 59.4 279.73 55.22 L 279.73 6.93 L 255.42 67.43 L 253.66 67.43 L 228.14 7.04 L 228.14 50.82 Q 228.14 56.1 229.075 58.74 Q 230.01 61.38 232.54 62.645 Q 235.07 63.91 240.35 64.68 L 240.35 66.88 Q 234.96 66.55 226.93 66.55 Q 221.1 66.55 217.8 66.88 L 217.8 64.68 Q 221.32 63.91 222.915 62.645 Q 224.51 61.38 225.06 58.795 Q 225.61 56.21 225.61 50.82 L 225.61 11.66 Q 225.61 7.48 224.95 5.61 Q 224.29 3.74 222.475 3.08 Q 220.66 2.42 216.7 2.2 L 216.7 0 Q 223.96 0.33 239.03 0.33 Q 245.08 0.33 249.15 0 L 264.77 37.4 L 279.73 0.33 L 292.6 0.33 Q 304.59 0.33 310.97 0 L 310.97 2.2 Q 307.01 2.42 305.195 3.08 Q 303.38 3.74 302.72 5.61 Q 302.06 7.48 302.06 11.66 Z M 214.94 60.83 L 216.48 62.26 Q 213.4 65.34 209.715 66.88 Q 206.03 68.42 200.31 68.42 Q 193.16 68.42 189.31 65.945 Q 185.46 63.47 184.36 59.07 L 181.28 46.64 Q 180.29 40.59 178.2 38.555 Q 176.11 36.52 172.04 36.52 L 170.17 36.52 L 170.17 55.22 Q 170.17 59.4 170.775 61.27 Q 171.38 63.14 172.92 63.8 Q 174.46 64.46 177.98 64.68 L 177.98 66.88 Q 170.94 66.55 157.41 66.55 Q 146.41 66.55 141.13 66.88 L 141.13 64.68 Q 144.65 64.46 146.245 63.8 Q 147.84 63.14 148.39 61.27 Q 148.94 59.4 148.94 55.22 L 148.94 11.66 Q 148.94 7.48 148.335 5.61 Q 147.73 3.74 146.19 3.08 Q 144.65 2.42 141.13 2.2 L 141.13 0 Q 146.41 0.33 156.75 0.33 L 170.17 0.22 Q 172.48 0.11 175.56 0.11 Q 207.57 0.11 207.57 17.05 Q 207.57 24.09 201.245 29.26 Q 194.92 34.43 179.96 35.75 Q 180.4 35.75 181.115 35.805 Q 181.83 35.86 182.82 36.08 Q 192.06 36.96 197.395 39.545 Q 202.73 42.13 204.16 47.85 L 206.47 57.53 Q 207.13 60.28 208.23 61.325 Q 209.33 62.37 211.09 62.37 Q 213.07 62.37 214.94 60.83 Z M 460.35 60.83 L 461.89 62.26 Q 458.81 65.34 455.125 66.88 Q 451.44 68.42 445.72 68.42 Q 438.57 68.42 434.72 65.945 Q 430.87 63.47 429.77 59.07 L 426.69 46.64 Q 425.7 40.59 423.61 38.555 Q 421.52 36.52 417.45 36.52 L 415.58 36.52 L 415.58 55.22 Q 415.58 59.4 416.185 61.27 Q 416.79 63.14 418.33 63.8 Q 419.87 64.46 423.39 64.68 L 423.39 66.88 Q 416.35 66.55 402.82 66.55 Q 391.82 66.55 386.54 66.88 L 386.54 64.68 Q 390.06 64.46 391.655 63.8 Q 393.25 63.14 393.8 61.27 Q 394.35 59.4 394.35 55.22 L 394.35 11.66 Q 394.35 7.48 393.745 5.61 Q 393.14 3.74 391.6 3.08 Q 390.06 2.42 386.54 2.2 L 386.54 0 Q 391.82 0.33 402.16 0.33 L 415.58 0.22 Q 417.89 0.11 420.97 0.11 Q 452.98 0.11 452.98 17.05 Q 452.98 24.09 446.655 29.26 Q 440.33 34.43 425.37 35.75 Q 425.81 35.75 426.525 35.805 Q 427.24 35.86 428.23 36.08 Q 437.47 36.96 442.805 39.545 Q 448.14 42.13 449.57 47.85 L 451.88 57.53 Q 452.54 60.28 453.64 61.325 Q 454.74 62.37 456.5 62.37 Q 458.48 62.37 460.35 60.83 Z M 139.15 64.68 L 139.15 66.88 Q 133.54 66.55 122.98 66.55 Q 109.67 66.55 103.4 66.88 L 103.4 64.68 Q 106.81 64.46 108.46 63.525 Q 110.11 62.59 110.11 60.39 Q 110.11 58.41 108.68 55.44 L 103.29 42.9 L 82.72 42.9 Q 78.98 51.48 78.98 56.65 Q 78.98 61.05 81.62 62.755 Q 84.26 64.46 89.21 64.68 L 89.21 66.88 Q 80.96 66.55 74.8 66.55 Q 69.63 66.55 66.33 66.88 L 66.33 64.68 Q 68.97 64.24 71.225 61.38 Q 73.48 58.52 76.45 51.81 L 99 0 Q 101.42 0.22 102.63 0.22 Q 103.84 0.22 106.26 0 L 132.66 57.64 Q 135.96 64.46 139.15 64.68 Z M 384.56 64.68 L 384.56 66.88 Q 378.95 66.55 368.39 66.55 Q 355.08 66.55 348.81 66.88 L 348.81 64.68 Q 352.22 64.46 353.87 63.525 Q 355.52 62.59 355.52 60.39 Q 355.52 58.41 354.09 55.44 L 348.7 42.9 L 328.13 42.9 Q 324.39 51.48 324.39 56.65 Q 324.39 61.05 327.03 62.755 Q 329.67 64.46 334.62 64.68 L 334.62 66.88 Q 326.37 66.55 320.21 66.55 Q 315.04 66.55 311.74 66.88 L 311.74 64.68 Q 314.38 64.24 316.635 61.38 Q 318.89 58.52 321.86 51.81 L 344.41 0 Q 346.83 0.22 348.04 0.22 Q 349.25 0.22 351.67 0 L 378.07 57.64 Q 381.37 64.46 384.56 64.68 Z M 32.01 39.82 L 29.04 39.82 L 29.04 55.22 Q 29.04 59.4 29.7 61.27 Q 30.36 63.14 32.175 63.8 Q 33.99 64.46 37.95 64.68 L 37.95 66.88 Q 30.58 66.55 16.28 66.55 Q 5.28 66.55 0 66.88 L 0 64.68 Q 3.52 64.46 5.115 63.8 Q 6.71 63.14 7.26 61.27 Q 7.81 59.4 7.81 55.22 L 7.81 11.66 Q 7.81 7.48 7.205 5.61 Q 6.6 3.74 5.06 3.08 Q 3.52 2.42 0 2.2 L 0 0 Q 5.28 0.33 15.62 0.33 L 29.7 0.22 Q 32.23 0.11 35.53 0.11 Q 51.59 0.11 59.015 4.73 Q 66.44 9.35 66.44 18.48 Q 66.44 27.61 58.575 33.715 Q 50.71 39.82 32.01 39.82 Z M 29.04 11.66 Q 29.04 7.7 29.48 5.72 Q 29.92 3.74 31.185 2.97 Q 32.45 2.2 34.98 2.2 Q 40.15 2.2 42.295 6.49 Q 44.44 10.78 44.44 19.69 Q 44.44 28.05 41.525 32.835 Q 38.61 37.62 30.91 37.62 L 29.04 37.62 L 29.04 11.66 Z M 170.17 11.66 Q 170.17 7.7 170.555 5.72 Q 170.94 3.74 171.93 2.97 Q 172.92 2.2 175.01 2.2 Q 180.73 2.2 183.15 6.215 Q 185.57 10.23 185.57 18.26 Q 185.57 25.85 182.93 30.085 Q 180.29 34.32 173.14 34.32 L 170.17 34.32 L 170.17 11.66 Z M 415.58 11.66 Q 415.58 7.7 415.965 5.72 Q 416.35 3.74 417.34 2.97 Q 418.33 2.2 420.42 2.2 Q 426.14 2.2 428.56 6.215 Q 430.98 10.23 430.98 18.26 Q 430.98 25.85 428.34 30.085 Q 425.7 34.32 418.55 34.32 L 415.58 34.32 L 415.58 11.66 Z M 83.6 40.7 L 92.95 19.14 L 102.3 40.7 L 83.6 40.7 Z M 329.01 40.7 L 338.36 19.14 L 347.71 40.7 L 329.01 40.7 Z"
];
const PROPS_PATHS = [
  "M 277.7 62.201 L 277.7 60.201 Q 280.9 60.001 282.35 59.401 Q 283.8 58.801 284.3 57.101 Q 284.8 55.401 284.8 51.601 L 284.8 12.001 Q 284.8 8.201 284.25 6.501 Q 283.7 4.801 282.3 4.201 Q 280.9 3.601 277.7 3.401 L 277.7 1.401 Q 288.7 1.701 310.7 1.701 Q 324.7 1.701 330.6 1.401 Q 329.9 8.501 329.9 14.201 Q 329.9 18.101 330.2 20.401 L 327.9 20.401 Q 325.9 11.501 321.55 7.601 Q 317.2 3.701 310.5 3.701 L 309.2 3.701 Q 306.4 3.701 305.25 4.701 Q 304.1 5.701 304.1 9.001 L 304.1 30.601 L 306.4 30.601 Q 311.2 30.601 314.05 27.151 Q 316.9 23.701 317.7 19.401 L 320 19.401 Q 319.7 22.801 319.7 27.401 L 319.7 31.601 Q 319.7 36.501 320.3 43.801 L 318 43.801 Q 317.3 39.001 314.3 35.801 Q 311.3 32.601 306.4 32.601 L 304.1 32.601 L 304.1 54.601 Q 304.1 57.901 305.25 58.901 Q 306.4 59.901 309.2 59.901 L 311.5 59.901 Q 318.5 59.901 323.15 55.551 Q 327.8 51.201 329.9 41.201 L 332.2 41.201 Q 331.9 44.001 331.9 48.401 Q 331.9 54.501 332.6 62.201 Q 326.1 61.901 310.7 61.901 Q 288.7 61.901 277.7 62.201 Z M 514.4 62.201 L 514.4 60.201 Q 517.6 60.001 519.05 59.401 Q 520.5 58.801 521 57.101 Q 521.5 55.401 521.5 51.601 L 521.5 12.001 Q 521.5 8.201 520.95 6.501 Q 520.4 4.801 519 4.201 Q 517.6 3.601 514.4 3.401 L 514.4 1.401 Q 525.4 1.701 547.4 1.701 Q 561.4 1.701 567.3 1.401 Q 566.6 8.501 566.6 14.201 Q 566.6 18.101 566.9 20.401 L 564.6 20.401 Q 562.6 11.501 558.25 7.601 Q 553.9 3.701 547.2 3.701 L 545.9 3.701 Q 543.1 3.701 541.95 4.701 Q 540.8 5.701 540.8 9.001 L 540.8 30.601 L 543.1 30.601 Q 547.9 30.601 550.75 27.151 Q 553.6 23.701 554.4 19.401 L 556.7 19.401 Q 556.4 22.801 556.4 27.401 L 556.4 31.601 Q 556.4 36.501 557 43.801 L 554.7 43.801 Q 554 39.001 551 35.801 Q 548 32.601 543.1 32.601 L 540.8 32.601 L 540.8 54.601 Q 540.8 57.901 541.95 58.901 Q 543.1 59.901 545.9 59.901 L 548.2 59.901 Q 555.2 59.901 559.85 55.551 Q 564.5 51.201 566.6 41.201 L 568.9 41.201 Q 568.6 44.001 568.6 48.401 Q 568.6 54.501 569.3 62.201 Q 562.8 61.901 547.4 61.901 Q 525.4 61.901 514.4 62.201 Z M 625.3 0.701 L 627.6 0.701 Q 627.1 7.201 627.1 23.101 L 624.8 23.101 Q 623.4 12.901 618.25 7.651 Q 613.1 2.401 605.6 2.401 Q 600.8 2.401 598 4.201 Q 595.2 6.001 595.2 8.901 Q 595.2 11.501 597.1 13.851 Q 599 16.201 602 18.301 Q 605 20.401 611.5 24.501 Q 617.5 28.001 621.3 30.851 Q 625.1 33.701 627.7 37.651 Q 630.3 41.601 630.3 46.601 Q 630.3 54.801 622.8 59.201 Q 615.3 63.601 602.8 63.601 Q 598 63.601 594.5 62.551 Q 591 61.501 586.2 59.601 Q 583.5 58.501 582.7 58.501 Q 581.8 58.501 581.3 59.551 Q 580.8 60.601 580.5 62.901 L 578.2 62.901 Q 578.6 56.901 578.6 36.901 L 580.9 36.901 Q 581.7 48.501 587.2 54.801 Q 592.7 61.101 602.1 61.101 Q 606.3 61.101 609.35 59.201 Q 612.4 57.301 612.4 53.401 Q 612.4 49.801 609.7 47.101 Q 607 44.401 600.1 40.101 Q 589.7 33.901 584.2 28.551 Q 578.7 23.201 578.7 16.601 Q 578.7 8.501 585.8 4.251 Q 592.9 0.001 604.5 0.001 Q 612.9 0.001 619.7 3.701 Q 620.8 4.301 621.65 4.701 Q 622.5 5.101 623.1 5.101 Q 624 5.101 624.5 4.051 Q 625 3.001 625.3 0.701 Z M 132 56.701 L 133.4 58.001 Q 130.6 60.801 127.25 62.201 Q 123.9 63.601 118.7 63.601 Q 112.2 63.601 108.7 61.351 Q 105.2 59.101 104.2 55.101 L 101.4 43.801 Q 100.5 38.301 98.6 36.451 Q 96.7 34.601 93 34.601 L 91.3 34.601 L 91.3 51.601 Q 91.3 55.401 91.85 57.101 Q 92.4 58.801 93.8 59.401 Q 95.2 60.001 98.4 60.201 L 98.4 62.201 Q 92 61.901 79.7 61.901 Q 69.7 61.901 64.9 62.201 L 64.9 60.201 Q 68.1 60.001 69.55 59.401 Q 71 58.801 71.5 57.101 Q 72 55.401 72 51.601 L 72 12.001 Q 72 8.201 71.45 6.501 Q 70.9 4.801 69.5 4.201 Q 68.1 3.601 64.9 3.401 L 64.9 1.401 Q 69.7 1.701 79.1 1.701 L 91.3 1.601 Q 93.4 1.501 96.2 1.501 Q 125.3 1.501 125.3 16.901 Q 125.3 23.301 119.55 28.001 Q 113.8 32.701 100.2 33.901 Q 100.6 33.901 101.25 33.951 Q 101.9 34.001 102.8 34.201 Q 111.2 35.001 116.05 37.351 Q 120.9 39.701 122.2 44.901 L 124.3 53.701 Q 124.9 56.201 125.9 57.151 Q 126.9 58.101 128.5 58.101 Q 130.3 58.101 132 56.701 Z M 406.7 56.701 L 408.1 58.001 Q 405.3 60.801 401.95 62.201 Q 398.6 63.601 393.4 63.601 Q 386.9 63.601 383.4 61.351 Q 379.9 59.101 378.9 55.101 L 376.1 43.801 Q 375.2 38.301 373.3 36.451 Q 371.4 34.601 367.7 34.601 L 366 34.601 L 366 51.601 Q 366 55.401 366.55 57.101 Q 367.1 58.801 368.5 59.401 Q 369.9 60.001 373.1 60.201 L 373.1 62.201 Q 366.7 61.901 354.4 61.901 Q 344.4 61.901 339.6 62.201 L 339.6 60.201 Q 342.8 60.001 344.25 59.401 Q 345.7 58.801 346.2 57.101 Q 346.7 55.401 346.7 51.601 L 346.7 12.001 Q 346.7 8.201 346.15 6.501 Q 345.6 4.801 344.2 4.201 Q 342.8 3.601 339.6 3.401 L 339.6 1.401 Q 344.4 1.701 353.8 1.701 L 366 1.601 Q 368.1 1.501 370.9 1.501 Q 400 1.501 400 16.901 Q 400 23.301 394.25 28.001 Q 388.5 32.701 374.9 33.901 Q 375.3 33.901 375.95 33.951 Q 376.6 34.001 377.5 34.201 Q 385.9 35.001 390.75 37.351 Q 395.6 39.701 396.9 44.901 L 399 53.701 Q 399.6 56.201 400.6 57.151 Q 401.6 58.101 403.2 58.101 Q 405 58.101 406.7 56.701 Z M 469.4 25.401 L 467.1 25.401 Q 464.3 13.601 460.25 8.651 Q 456.2 3.701 449.7 3.701 L 448.8 3.701 L 448.8 50.601 Q 448.8 54.801 449.6 56.701 Q 450.4 58.601 452.4 59.301 Q 454.4 60.001 458.9 60.201 L 458.9 62.201 Q 453.3 61.901 438.7 61.901 Q 424.2 61.901 419.4 62.201 L 419.4 60.201 Q 423.9 60.001 425.9 59.301 Q 427.9 58.601 428.7 56.701 Q 429.5 54.801 429.5 50.601 L 429.5 3.701 L 428.6 3.701 Q 422.1 3.701 418.05 8.651 Q 414 13.601 411.2 25.401 L 408.9 25.401 Q 409.2 22.201 409.2 16.201 Q 409.2 9.701 408.5 1.401 Q 417.4 1.701 438.7 1.701 Q 460.6 1.701 469.8 1.401 Q 469.1 9.701 469.1 16.201 Q 469.1 22.201 469.4 25.401 Z M 29.1 37.601 L 26.4 37.601 L 26.4 51.601 Q 26.4 55.401 27 57.101 Q 27.6 58.801 29.25 59.401 Q 30.9 60.001 34.5 60.201 L 34.5 62.201 Q 27.8 61.901 14.8 61.901 Q 4.8 61.901 0 62.201 L 0 60.201 Q 3.2 60.001 4.65 59.401 Q 6.1 58.801 6.6 57.101 Q 7.1 55.401 7.1 51.601 L 7.1 12.001 Q 7.1 8.201 6.55 6.501 Q 6 4.801 4.6 4.201 Q 3.2 3.601 0 3.401 L 0 1.401 Q 4.8 1.701 14.2 1.701 L 27 1.601 Q 29.3 1.501 32.3 1.501 Q 46.9 1.501 53.65 5.701 Q 60.4 9.901 60.4 18.201 Q 60.4 26.501 53.25 32.051 Q 46.1 37.601 29.1 37.601 Z M 241.9 37.601 L 239.2 37.601 L 239.2 51.601 Q 239.2 55.401 239.8 57.101 Q 240.4 58.801 242.05 59.401 Q 243.7 60.001 247.3 60.201 L 247.3 62.201 Q 240.6 61.901 227.6 61.901 Q 217.6 61.901 212.8 62.201 L 212.8 60.201 Q 216 60.001 217.45 59.401 Q 218.9 58.801 219.4 57.101 Q 219.9 55.401 219.9 51.601 L 219.9 12.001 Q 219.9 8.201 219.35 6.501 Q 218.8 4.801 217.4 4.201 Q 216 3.601 212.8 3.401 L 212.8 1.401 Q 217.6 1.701 227 1.701 L 239.8 1.601 Q 242.1 1.501 245.1 1.501 Q 259.7 1.501 266.45 5.701 Q 273.2 9.901 273.2 18.201 Q 273.2 26.501 266.05 32.051 Q 258.9 37.601 241.9 37.601 Z M 170.7 0.001 Q 181.4 0.001 189.45 3.651 Q 197.5 7.301 201.95 14.351 Q 206.4 21.401 206.4 31.201 Q 206.4 40.801 201.85 48.151 Q 197.3 55.501 189.15 59.551 Q 181 63.601 170.6 63.601 Q 159.9 63.601 151.85 59.951 Q 143.8 56.301 139.35 49.251 Q 134.9 42.201 134.9 32.401 Q 134.9 22.801 139.45 15.451 Q 144 8.101 152.15 4.051 Q 160.3 0.001 170.7 0.001 Z M 508.6 1.401 L 508.6 3.401 Q 505.4 3.601 503.95 4.201 Q 502.5 4.801 502 6.501 Q 501.5 8.201 501.5 12.001 L 501.5 51.601 Q 501.5 55.401 502 57.101 Q 502.5 58.801 503.95 59.401 Q 505.4 60.001 508.6 60.201 L 508.6 62.201 Q 503.1 61.901 492.4 61.901 Q 480.5 61.901 475.1 62.201 L 475.1 60.201 Q 478.3 60.001 479.75 59.401 Q 481.2 58.801 481.7 57.101 Q 482.2 55.401 482.2 51.601 L 482.2 12.001 Q 482.2 8.201 481.65 6.501 Q 481.1 4.801 479.7 4.201 Q 478.3 3.601 475.1 3.401 L 475.1 1.401 Q 480.5 1.701 492.4 1.701 Q 503 1.701 508.6 1.401 Z M 170.3 1.801 Q 174.8 1.801 178.45 5.451 Q 182.1 9.101 184.25 15.901 Q 186.4 22.701 186.4 31.601 Q 186.4 40.401 184.5 47.251 Q 182.6 54.101 179.1 57.951 Q 175.6 61.801 171 61.801 Q 166.5 61.801 162.85 58.151 Q 159.2 54.501 157.05 47.701 Q 154.9 40.901 154.9 32.001 Q 154.9 23.201 156.8 16.351 Q 158.7 9.501 162.2 5.651 Q 165.7 1.801 170.3 1.801 Z M 26.4 12.001 Q 26.4 8.401 26.8 6.601 Q 27.2 4.801 28.35 4.101 Q 29.5 3.401 31.8 3.401 Q 36.5 3.401 38.45 7.301 Q 40.4 11.201 40.4 19.301 Q 40.4 26.901 37.75 31.251 Q 35.1 35.601 28.1 35.601 L 26.4 35.601 L 26.4 12.001 Z M 239.2 12.001 Q 239.2 8.401 239.6 6.601 Q 240 4.801 241.15 4.101 Q 242.3 3.401 244.6 3.401 Q 249.3 3.401 251.25 7.301 Q 253.2 11.201 253.2 19.301 Q 253.2 26.901 250.55 31.251 Q 247.9 35.601 240.9 35.601 L 239.2 35.601 L 239.2 12.001 Z M 91.3 12.001 Q 91.3 8.401 91.65 6.601 Q 92 4.801 92.9 4.101 Q 93.8 3.401 95.7 3.401 Q 100.9 3.401 103.1 7.051 Q 105.3 10.701 105.3 18.001 Q 105.3 24.901 102.9 28.751 Q 100.5 32.601 94 32.601 L 91.3 32.601 L 91.3 12.001 Z M 366 12.001 Q 366 8.401 366.35 6.601 Q 366.7 4.801 367.6 4.101 Q 368.5 3.401 370.4 3.401 Q 375.6 3.401 377.8 7.051 Q 380 10.701 380 18.001 Q 380 24.901 377.6 28.751 Q 375.2 32.601 368.7 32.601 L 366 32.601 L 366 12.001 Z"
];

export const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [viewportH, setViewportH] = useState(0);
  const [scrollVh, setScrollVh] = useState(500);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const pathLengthsRef = useRef<number[]>([]);
  const letterStartRef = useRef<number[]>([]);
  const letterEndRef = useRef<number[]>([]);
  const pathsInitRef = useRef(false);

  // Viewport height, responsive scroll-jack height, and prefers-reduced-motion tracking
  useEffect(() => {
    // 1. Viewport Height Setup
    setViewportH(document.documentElement.clientHeight);

    // 2. Responsive Scroll-Jack Height Setup
    const mQueryMobile = window.matchMedia("(max-width: 767px)");
    const updateScrollVh = (e: MediaQueryListEvent | MediaQueryList) => {
      setScrollVh(e.matches ? 320 : 700); // 700vh desktop gives enough time for all phases
    };
    updateScrollVh(mQueryMobile);

    // 3. Prefers-Reduced-Motion Setup
    const mQueryMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = (e: MediaQueryListEvent | MediaQueryList) => {
      setPrefersReducedMotion(e.matches);
    };
    updateMotionPreference(mQueryMotion);

    // Add listeners
    if (mQueryMobile.addEventListener) {
      mQueryMobile.addEventListener("change", updateScrollVh);
      mQueryMotion.addEventListener("change", updateMotionPreference);
    } else {
      // fallback for older browsers
      mQueryMobile.addListener(updateScrollVh);
      mQueryMotion.addListener(updateMotionPreference);
    }

    // Debounced Resize Handler (~150ms)
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    const onResize = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setViewportH(document.documentElement.clientHeight);
      }, 150);
    };
    window.addEventListener("resize", onResize);

    return () => {
      if (mQueryMobile.removeEventListener) {
        mQueryMobile.removeEventListener("change", updateScrollVh);
        mQueryMotion.removeEventListener("change", updateMotionPreference);
      } else {
        mQueryMobile.addListener
          ? mQueryMobile.removeEventListener("change", updateScrollVh)
          : (mQueryMobile as any).removeListener(updateScrollVh);
        mQueryMotion.addListener
          ? mQueryMotion.removeEventListener("change", updateMotionPreference)
          : (mQueryMotion as any).removeListener(updateMotionPreference);
      }
      window.removeEventListener("resize", onResize);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  // Compute real path lengths once mounted ([] = run once after first render)
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || pathsInitRef.current) return;
    const pathEls = Array.from(svg.querySelectorAll<SVGPathElement>(".lp"));
    if (!pathEls.length) return;

    const lens = pathEls.map((el) => {
      const len = el.getTotalLength();
      el.style.strokeDasharray = String(len);
      el.style.strokeDashoffset = String(len); // hidden initially
      return len;
    });

    // Both paths start at same time, draw slowly across a wider scroll window
    // PARMAR + PROPERTIES: both scroll 0.25 → 0.65 (slower draw)
    const starts = [0.25, 0.25];
    const ends = [0.65, 0.65];

    pathLengthsRef.current = lens;
    letterStartRef.current = starts;
    letterEndRef.current = ends;
    pathsInitRef.current = true;
  }, []);

  // Scroll progress
  useEffect(() => {
    const handle = () => {
      if (prefersReducedMotion) {
        setScrollProgress(0);
        return;
      }
      const section = sectionRef.current;
      if (!section) return;
      const scrolled = window.scrollY - section.offsetTop;
      const range = section.offsetHeight - (viewportH || document.documentElement.clientHeight);
      setScrollProgress(range > 0 ? Math.max(0, Math.min(1, scrolled / range)) : 0);
    };
    window.addEventListener("scroll", handle, { passive: true });
    handle();
    return () => window.removeEventListener("scroll", handle);
  }, [viewportH, prefersReducedMotion]);

  // Sync <header> opacity
  useEffect(() => {
    const header = document.querySelector("header") as HTMLElement | null;
    if (!header) return;

    const updateHeaderStyle = () => {
      const isMenuOpen = header.getAttribute("data-mobile-menu-open") === "true";
      if (isMenuOpen) {
        // Reset styles so mobile menu is visible and interactive
        header.style.opacity = "";
        header.style.pointerEvents = "";
        header.style.transition = "";
      } else {
        const p1 = Math.min(1, scrollProgress / 0.45); // phase 1 ends at 0.45
        const opacity = Math.max(0, 1 - p1 * 4);
        header.style.opacity = String(opacity);
        header.style.pointerEvents = opacity < 0.05 ? "none" : "";
        header.style.transition = "opacity 0.1s linear";
      }
    };

    // Run initially
    updateHeaderStyle();

    // Observe changes to attributes (specifically data-mobile-menu-open)
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "attributes" && mutation.attributeName === "data-mobile-menu-open") {
          updateHeaderStyle();
        }
      }
    });

    observer.observe(header, { attributes: true, attributeFilter: ["data-mobile-menu-open"] });

    return () => {
      observer.disconnect();
      header.style.opacity = header.style.pointerEvents = header.style.transition = "";
    };
  }, [scrollProgress]);

  // Drive per-path dashoffsets — each path has its own scroll range
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || !pathsInitRef.current) return;
    const pathEls = Array.from(svg.querySelectorAll<SVGPathElement>(".lp"));
    if (!pathEls.length) return;

    const lens = pathLengthsRef.current;
    const starts = letterStartRef.current;
    const ends = letterEndRef.current;

    pathEls.forEach((el, i) => {
      const len = lens[i] ?? 0;
      const s = starts[i] ?? 0;  // this path's scroll start
      const e = ends[i] ?? 1;  // this path's scroll end
      const t = Math.max(0, Math.min(1, (scrollProgress - s) / (e - s)));
      el.style.strokeDashoffset = String(len * (1 - t));
    });
  }, [scrollProgress]);

  const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
  const easeOut2 = (t: number) => 1 - Math.pow(1 - t, 2);

  // ─── Phase map ─────────────────────────────────────────────────────
  // Phase 1 : 0.00 → 0.40  building rises, text sinks behind it
  // Phase 2 : 0.40 → 0.75  SVG strokes draw ON building + image fill simultaneously
  //                          NO SMOKE during this phase — building stays fully visible
  // Phase 3 : 0.75 → 0.92  smoke/fog blazes in (AFTER SVG is complete)
  // Phase 4 : 0.92 → 1.00  white exit — next section begins
  // ───────────────────────────────────────────────────────────
  const p1 = Math.min(1, scrollProgress / 0.40);                            // building rise (0→0.40)
  const p3 = Math.max(0, Math.min(1, (scrollProgress - 0.25) / 0.20));     // SVG strokes (0.25→0.45)
  const p4 = Math.max(0, Math.min(1, (scrollProgress - 0.65) / 0.17));     // image fill (0.65→0.82)
  const p2 = Math.max(0, Math.min(1, (scrollProgress - 0.80) / 0.20));     // smoke (0.80→1.00)
  const p5 = Math.max(0, Math.min(1, (scrollProgress - 0.92) / 0.08));     // white exit

  const p1e = easeOut(p1);
  const p2e = easeOut(p2);
  const p3e = easeOut(p3);
  const p4e = easeOut(p4);

  // Sky zoom (very subtle)
  const skyScale = 1 + p1e * 0.06;

  // Building: anchored at top, starts with top-edge at 35% from viewport top
  // Moves upward continuously: from translateY(35%) → translateY(-45%) across full scroll
  const buildingY = 35 - scrollProgress * 80;
  const buildingOpacity = Math.max(0.15, 1 - p2e);  // only fades when smoke starts at 0.75

  // Hero content: sinks DOWN into the rising building
  const contentOpacity = Math.max(0, 1 - p1 * 2.0);
  const contentY = p1e * 120;

  // Clouds fade as SVG strokes begin
  const cloudLeftX = -p1e * 80;
  const cloudRightX = p1e * 80;
  const cloudSideOpacity = Math.max(0, 1 - p3e * 2);

  // Smoke — ONLY starts AFTER SVG is done (0.75+)
  const smokeY = 40 - p2e * 75;
  const smokeScale = 1.0 + p2e * 2.2;
  const smokeOpacity = 1; // Always 1

  // SVG text layer — appears right as building phase ends / SVG phase starts
  const textLayerOpacity = easeOut2(Math.max(0, Math.min(1, (scrollProgress - 0.24) / 0.04)));
  const maskScale = 0.40 + p3e * 0.05;
  // Building image scrolls from below (y=+30%) to above (y=-30%) inside letter cutouts during SVG+image phase
  const maskParallaxY = 30 - p4e * 60;

  // Strokes draw in during p3 (0.40→0.75), fade out as image fill takes over (p4)
  const strokeOpacity = Math.max(0, Math.min(1, p3 * 5));

  // Image fill: starts slightly after strokes begin (0.42), completes with strokes at 0.75
  const fillProgress = easeOut(p4);

  // Dark tint: only during building rise phase
  const darkOpacity = 0.10 * (1 - p1e);

  // Bottom gradient fades as SVG starts
  const bottomGradientOpacity = Math.max(0, 1 - p3e * 2);

  // White exit
  const whiteOpacity = p5;

  return (
    <>
      <style>{`
        @keyframes layerEntrance {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes heroEntrance {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes heroLetterEntrance {
          from {
            opacity: 0;
            transform: translateY(40px);
            filter: blur(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0px);
          }
        }
        @keyframes heroPopUp {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.92);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes cloudDrift {
          from {
            transform: translateX(-10%);
          }
          to {
            transform: translateX(10%);
          }
        }
        @keyframes buildingDrift {
          from {
            transform: translateX(-3%);
          }
          to {
            transform: translateX(3%);
          }
        }
        .animate-layer-entrance {
          animation: layerEntrance 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
          will-change: transform, opacity;
        }
        .animate-hero-letter {
          display: inline-block;
          animation: heroLetterEntrance 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
          will-change: transform, opacity, filter;
        }
        .animate-hero-paragraph {
          animation: heroEntrance 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          animation-delay: 1200ms;
          opacity: 0;
        }
        .animate-hero-strong {
          animation: heroEntrance 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          animation-delay: 1350ms;
          opacity: 0;
        }
        .animate-hero-button {
          animation: heroPopUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          animation-delay: 1500ms;
          opacity: 0;
        }
        .animate-cloud-drift {
          width: 120%;
          max-w: none !important;
          margin-left: -10%;
          animation: cloudDrift 28s ease-in-out infinite alternate;
        }
        .animate-building-drift {
          width: 106%;
          max-w: none !important;
          margin-left: -3%;
          animation: buildingDrift 38s ease-in-out infinite alternate;
        }
      `}</style>
      {/* Dynamic scroll room so mobile devices have a shorter scroll distance */}
      <section ref={sectionRef} style={{ height: `${scrollVh}vh` }} className="relative w-full">
        <div className="sticky top-0 h-screen w-full overflow-hidden">

          {/* ── Layer 1: Sky ── */}
          <div className="absolute inset-0"
            style={{ transform: `scale(${skyScale})`, transformOrigin: "center center", willChange: "transform" }}>
            <div className="animate-layer-entrance w-full h-full">
              <img src={heroBg} alt="" aria-hidden="true" className="w-full h-full object-cover" />
            </div>
          </div>

          {/* ── Layer 2: Dark tint (phase 1) ── */}
          <div className="absolute inset-0 bg-black pointer-events-none" style={{ opacity: darkOpacity }} />

          {/* ── Layer 3: Building — full width, starts at 35% from top, rises on scroll ── */}
          <div className="absolute top-0 inset-x-0 pointer-events-none"
            style={{
              zIndex: 25,
              transform: `translateY(${buildingY}%)`,
              transformOrigin: "top center",
              opacity: buildingOpacity,
              willChange: "transform, opacity",
            }}>
            <div className="animate-layer-entrance">
              <img
                src={heroBuilding}
                alt="Luxury real estate building"
                className="block w-full"
                style={{
                  height: "auto",
                  objectFit: "cover",
                }}
              />
            </div>
          </div>

          {/* ── Layer 4a: Left Cloud — z-28, above building, bottom-left corner ── */}
          <div className="absolute pointer-events-none"
            style={{ zIndex: 28, bottom: "-5%", left: "-15%", width: "52%", opacity: cloudSideOpacity, transform: `translateX(${cloudLeftX}px)` }}>
            <div className="animate-layer-entrance">
              <div className="animate-cloud-drift">
                <img src={heroCloud} alt="" aria-hidden="true" className="w-full h-auto" />
              </div>
            </div>
          </div>

          {/* ── Layer 4b: Right Cloud — z-28, above building, bottom-right corner ── */}
          <div className="absolute pointer-events-none"
            style={{ zIndex: 28, bottom: "-5%", right: "-15%", width: "52%", opacity: cloudSideOpacity, transform: `translateX(${cloudRightX}px) scaleX(-1)` }}>
            <div className="animate-layer-entrance">
              <div className="animate-cloud-drift" style={{ animationDelay: "-14s" }}>
                <img src={heroCloud} alt="" aria-hidden="true" className="w-full h-auto" />
              </div>
            </div>
          </div>

          {/* ── Layer 5: Bottom gradient ── */}
          <div className="absolute bottom-0 inset-x-0 pointer-events-none z-20"
            style={{ height: "40%", background: "linear-gradient(to top, rgba(255,255,255,0.65) 0%, transparent 100%)", opacity: bottomGradientOpacity }} />

          {/* ── Layer 6: SMOKE — rises to cover entire screen ── */}
          <div className="absolute pointer-events-none z-30"
            style={{
              bottom: "-20%",
              left: "-20%",
              width: "140%",
              opacity: smokeOpacity,
              transform: `translateY(${smokeY}%) scale(${smokeScale})`,
              willChange: "transform, opacity",
            }}>
            <img src={heroCloudScroll} alt="" aria-hidden="true"
              className="w-full h-auto object-cover"
              style={{ minHeight: "70vh" }} />
          </div>

          {/* ── Layer 7: PARMAR PROPERTIES — strokes + image fill ── */}
          <div className="absolute inset-0 pointer-events-none z-40"
            style={{
              opacity: textLayerOpacity,
              transform: `scale(${maskScale})`,
              transformOrigin: "center center",
              willChange: "transform, opacity",
            }}>

            <svg
              ref={svgRef}
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 760 180"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              preserveAspectRatio="xMidYMid meet"
              aria-hidden="true"
            >
              <defs>
                <mask id="parmar-mask">
                  <rect width="100%" height="100%" fill="black" />

                  {/* PARMAR group */}
                  <g transform="translate(119, 10) scale(1)">
                    <path fill="white" d={PARMAR_PATHS[0]} />
                  </g>

                  {/* PROPERTIES group */}
                  <g transform="translate(34, 105) scale(1.11)">
                    <path fill="white" d={PROPS_PATHS[0]} />
                  </g>
                </mask>
              </defs>

              {/* Image fill through letter cutouts — building scrolls from bottom to top inside letters */}
              <g mask="url(#parmar-mask)" style={{ opacity: fillProgress }}>
                {/* Sky background — static behind the building */}
                <image xlinkHref={heroBg}
                  x="0" y="0" width="100%" height="100%"
                  preserveAspectRatio="xMidYMid slice" />
                {/* Building — scrolls upward through the letter windows */}
                <image xlinkHref={heroBuilding}
                  x="-10%" y={`${maskParallaxY}%`} width="120%" height="150%"
                  preserveAspectRatio="xMidYMid meet" />
              </g>

              {/* PARMAR strokes — draw in per letter */}
              <g transform="translate(119, 10) scale(1)">
                <path className="lp" d={PARMAR_PATHS[0]} fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity={1} />
              </g>
              {/* PROPERTIES strokes */}
              <g transform="translate(34, 105) scale(1.11)">
                <path className="lp" d={PROPS_PATHS[0]} fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity={1} />
              </g>
            </svg>
          </div>

          {/* ── Layer 8: White exit cover ── */}
          <div className="absolute inset-0 bg-white pointer-events-none z-50" style={{ opacity: whiteOpacity }} />

          {/* ── Layer 9: Hero content — z-10, BELOW building (z-25) so building rises over text ── */}
          <div className="absolute inset-0 flex flex-col items-center justify-start text-center px-6"
            style={{ zIndex: 10, paddingTop: "12vh", opacity: contentOpacity, transform: `translateY(${contentY}px)`, pointerEvents: contentOpacity < 0.05 ? "none" : "auto" }}>
            <h1 className="text-black font-bold leading-[1.05] mb-5 overflow-hidden flex flex-wrap justify-center"
              style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: "clamp(32px, 5.5vw, 80px)", letterSpacing: "0.03em", textShadow: "none" }}>
              {"Access. Influence. Legacy".split("").map((char, index) => (
                <span
                  key={index}
                  className="animate-hero-letter"
                  style={{ animationDelay: `${300 + index * 60}ms` }}
                >
                  {char === " " ? "\u00A0" : char}
                </span>
              ))}
            </h1>
            <p className="text-black/85 mb-10 max-w-xl leading-relaxed animate-hero-strong"
              style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: "clamp(15px, 1.4vw, 19px)" }}>
              <strong className="font-semibold text-black">SOUTH MUMBAI'S TRUSTED LUXURY REAL ESTATE ADVISORY SINCE 1985</strong>
            </p>
            <a href="https://parmarproperties.in/contact"
              className="inline-flex items-center gap-2 bg-gray-900 text-white font-semibold rounded-full px-7 py-3.5 hover:bg-gray-800 transition-colors animate-hero-button"
              style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: "clamp(14px, 1.1vw, 16px)" }}>
              Explore Opportunities <span>→</span>
            </a>
          </div>

          {/* ── Layer 10: Scroll hint ── */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none select-none z-30"
            style={{ opacity: Math.max(0, 1 - p1 * 4) }}>
            <span className="text-[10px] tracking-[0.3em] uppercase text-white/60"
              style={{ fontFamily: "'Instrument Sans', sans-serif" }}>Scroll</span>
            <div className="w-px h-8 bg-gradient-to-b from-white/50 to-transparent animate-pulse" />
          </div>

        </div>
      </section>
    </>
  );
};