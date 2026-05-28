/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface MemoryImage {
  id: string;
  src: string;
  caption: string;
  date?: string;
  isUserUploaded?: boolean;
  objectPosition?: string;
}

export interface TimelineItem {
  id: string;
  title: string;
  period: string;
  description: string;
  emoji: string;
  bgColor: string;
  borderColor: string;
  shadowColor: string;
}

export interface SecretBox {
  id: string;
  label: string;
  frontEmoji: string;
  revealEmoji: string;
  type: "quote" | "message" | "explosion" | "modal";
  content: string;
  color: string;
}

export interface PlaylistItem {
  id: string;
  name: string;
  description: string;
  emoji: string;
}
