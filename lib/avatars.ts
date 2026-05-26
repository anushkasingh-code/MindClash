/** Local character avatar paths under public/avatars/ */
export function getCharacterAvatarPath(characterId: string): string {
  return `/avatars/${characterId}.svg`;
}
