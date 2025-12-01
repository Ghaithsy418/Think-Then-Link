import { Toaster } from 'react-hot-toast';
import MainGameUi from './game/main/MainGameUi';
import SelectBoardSize from './game/setupBoard/SelectBoardSize';
import SetupGameUi from './game/setupBoard/SetupGameUi';
import useGameStore from './store/gameStore';

function App() {
  const gameStatus = useGameStore((state) => state.gameStatus);

  return (
    <div className="h-screen w-screen bg-linear-to-tr from-rose-700/10 to-slate-700/30 via-violet-700/10">
      <div className="w-screen h-screen flex items-center justify-center bg-linear-to-br from-slate-950 via-purple-950 to-slate-950 relative overflow-hidden">
        {gameStatus === 'gridSize' && <SelectBoardSize />}
        {gameStatus === 'setupGrid' && <SetupGameUi />}
        {gameStatus === 'gameStarted' && <MainGameUi />}
      </div>
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toasterId="default"
        toastOptions={{
          className: '',
          duration: 5000,
          removeDelay: 1000,
          style: {
            background: '#363636',
            color: '#fff',
          },

          success: {
            duration: 3000,
            iconTheme: {
              primary: 'green',
              secondary: 'black',
            },
          },
        }}
      />
    </div>
  );
}

export default App;
