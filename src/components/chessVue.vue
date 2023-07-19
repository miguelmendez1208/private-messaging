<template>
  <div id="app">

    <h1>CometChess! </h1>
    <chessboard @onMove="showInfo" :fen="user.fenCurrent"/>
  </div>
</template>

<script>
import {chessboard} from 'vue-chessboard'
import 'vue-chessboard/dist/vue-chessboard.css'
import bus from './bus.js'

export default {
  name: 'app',
  components: {
    chessboard
  }, 
  //extends: chessboard,
  props: {
    user: Object,
  },
  data () {
    return {
      currentFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR',
      positionInfo: null
    }
  },
  //mounted(){
  //    this.board.set({
  //      movable: {
  //        color: this.toColor()}
  //    })
  //},
  methods: {
    showInfo(data) {
      this.positionInfo = data
      //emit data
      this.$emit("chess", this.positionInfo.fen);
    },
    loadFen(fen) {
      if(this.currentFen!=fen){
      this.currentFen = fen
      }
    },
    displaySender(message, index) {
      return (
        index === 0 ||
        this.user.messages[index - 1].fromSelf !==
          this.user.messages[index].fromSelf
      );
    },
    promote() {
      if (confirm("Want to promote to rook? Queen by default") ) {
        return 'r'
      } else {
        return 'q'
      }
    },
    undo() {
      bus.$emit('undo')
    }
  },
  created() {
    this.fens = ['rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
                'r4rk1/pp1b3p/6p1/8/3NpP2/1P4P1/P2K3P/R6R w - - 0 22'
                ]
    this.fenLoad = 'rnbqkbnr/pp1ppppp/8/2p5/4P3/5P2/PPPP2PP/RNBQKBNR b KQkq - 0 2'
    
  }
  
}
</script>
<style>
.messages {
  margin: 0;
  padding: 0px;
}
.message {
  list-style: none;
}

</style>