import { useState } from 'react'
import {
    Drawer,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Divider,
    Toolbar,
    Typography,
    makeStyles,
    createStyles,
    Box,
} from '@material-ui/core'
import { Link } from 'react-router-dom'
import MenuIcon from '@material-ui/icons/Menu'
import CloseIcon from '@material-ui/icons/Close'

import './drawer.scss'

const useStyles = makeStyles(() =>
    createStyles({
        link: {
            textDecoration: 'none',
            color: '#d0d1d5',
            fontSize: '20px',
            letterSpacing: '0.1em',
        },
        icon: { color: '#d0d1d5' },
        logo: { flexGrow: 1, cursor: 'pointer', color: '#d0d1d5' },
        draw: { background: 'red' },
    }),
)

function DrawerComponent() {
    const classes = useStyles()
    const [openDrawer, setOpenDrawer] = useState(false)

    return (
        <div>
            <Drawer
                anchor='top'
                style={{ width: 250 }}
                open={openDrawer}
                onClose={() => setOpenDrawer(false)}
            >
                <Toolbar className='drawer-head'>
                    <Typography variant='h4' className={classes.logo}>
                        SOCIETYKEY
                    </Typography>
                    <CloseIcon
                        style={{ color: '#d0d1d5', cursor: 'pointer' }}
                        onClick={() => setOpenDrawer(false)}
                    />
                </Toolbar>
                <Box className='drawer-middle'>
                    <List>
                        {/* <Divider />
            <ListItem onClick={() => setOpenDrawer(false)}>
              <ListItemText>
                <Link to='/' className={classes.link}>
                  HOME
                </Link>
              </ListItemText>
            </ListItem> */}
                        <Divider />
                        <ListItem onClick={() => setOpenDrawer(false)}>
                            <ListItemText>
                                <Link to='/' className={classes.link}>
                                    SOCIETYKEY
                                </Link>
                            </ListItemText>
                        </ListItem>
                        <Divider />
                        <ListItem onClick={() => setOpenDrawer(false)}>
                            <ListItemText>
                                <a
                                    href='http://localist.societykey.app/'
                                    className={classes.link}
                                >
                                    SOCIETY LOCALIST
                                </a>
                            </ListItemText>
                        </ListItem>
                        <Divider />
                        <ListItem onClick={() => setOpenDrawer(false)}>
                            {/* <ListItemText> */}
                            <a
                                href='https://www.societyrides.com/'
                                className={classes.link}
                            >
                                SOCIETY RIDES-NONPROFIT RIDESHARE
                            </a>
                            {/* </ListItemText> */}
                        </ListItem>
                        <Divider />
                    </List>
                </Box>
            </Drawer>
            <IconButton
                className={classes.icon}
                onClick={() => setOpenDrawer(!openDrawer)}
            >
                <MenuIcon />
            </IconButton>
        </div>
    )
}

export default DrawerComponent
