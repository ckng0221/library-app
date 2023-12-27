import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { Fragment, ReactNode } from 'react';

type Anchor = 'left';

interface IProp {
  openDrawer: { left: boolean };
  setOpenDrawer: ({ left }: { left: boolean }) => void;
  DrawerListComp: ReactNode;
}

export default function Drawer(props: IProp) {
  const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event &&
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }

      props.setOpenDrawer({ ...props.openDrawer, [anchor]: open });
    };

  return (
    <div>
      {(['left'] as const).map((anchor) => (
        <Fragment key={anchor}>
          <SwipeableDrawer
            anchor={anchor}
            open={props.openDrawer[anchor]}
            onClose={toggleDrawer(anchor, false)}
            onOpen={toggleDrawer(anchor, true)}
          >
            {props.DrawerListComp}
          </SwipeableDrawer>
        </Fragment>
      ))}
    </div>
  );
}
