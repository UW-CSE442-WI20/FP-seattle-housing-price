import * as React from 'react';
import {List, arrayMove} from 'baseui/dnd-list';

export default class DragDropList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [
        'Item 1',
        'Item 2',
        'Item 3',
        'Item 4',
        'Item 5',
        'Item 6',
      ],
    };
  }

  render() {
    console.log(this.state.items)
    return (
      <List
        items={this.state.items}
        onChange={({oldIndex, newIndex}) =>
          this.setState(prevState => ({
            items: arrayMove(prevState.items, oldIndex, newIndex),
          }))
        }
      />
    );
  }
}

// import * as React from 'react';
// import {StatefulList} from 'baseui/dnd-list';

// export default () => (
//   <StatefulList
//     removable
//     removableByMove
//     initialState={{
//       items: [
//         'Item 1',
//         'Item 2',
//         'Item 3',
//         'Item 4',
//         'Item 5',
//         'Item 6',
//       ],
//     }}
//     overrides={{
//       Root: {
//         style: {
//           maxWidth: '300px',
//           position: 'absolute'
//         },
//       },
//     }}
//     onChange={console.log}
//   />
// );