import classes from './App.module.scss';

import WhiteBoard from './components/white_board/WhiteBoard';


function App() {
  return (
    <div className={classes.page_wrap}>
      <WhiteBoard />
    </div>
  );
}

export default App;
