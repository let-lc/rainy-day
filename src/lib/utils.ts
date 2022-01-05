export const formatTime = (time: number): string => {
  const int = Math.floor(time);
  const seconds = int % 60;
  const minutes = Math.floor((int % 3600) / 60);
  const hours = Math.floor(int / 3600);
  return hours + ':' + String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');
};

export const updatePlayHistory = (currentSong: CurrentSong): void => {
  if (typeof localStorage !== 'undefined') {
    const history = localStorage.getItem('history');
    if (!history) {
      localStorage.setItem('history', JSON.stringify([currentSong]));
    } else if (Array.isArray(JSON.parse(history))) {
      const hisArr: Array<CurrentSong> = JSON.parse(history);
      localStorage.setItem('history', JSON.stringify([...hisArr.slice(-9), currentSong]));
    }
  }
};

export const getPreviousVideoUrl = (): string => {
  if (typeof localStorage === 'undefined') return '';

  const history = localStorage.getItem('history');
  if (!history) return '';

  const hisArr: Array<CurrentSong> = JSON.parse(history);
  if (Array.isArray(hisArr) && hisArr.length > 0) {
    localStorage.setItem('history', JSON.stringify(hisArr.slice(0, -1)));
    return hisArr[hisArr.length - 1]?.videoUrl || '';
  } else return '';
};
