import React from "react";

import * as Fa_Icons from 'react-icons/fa';
import * as Ai_Icons from 'react-icons/ai';
import * as Io_Icons from 'react-icons/io';
import * as Bs_Icons from 'react-icons/bs';

export const SidebarData = [
    {
        title: 'Home',
        path: '/',
        icon: <Ai_Icons.AiFillHome />,
        cName: 'nav-text'
    },

    {
        title: 'Report',
        path: '/reports',
        icon: <Io_Icons.IoIosPaper />,
        cName: 'nav-text'
    },

    {
        title: 'Course',
        path: '/',
        icon: <Bs_Icons.BsFillBookFill />,
        cName: 'nav-text'
    },

    {
        title: 'About Me',
        path: '/about',
        icon: <Io_Icons.IoMdPeople />,
        cName: 'nav-text'
    },

    {
        title: 'Massages',
        path: '/messages',
        icon: <Fa_Icons.FaEnvelopeOpenText />,
        cName: 'nav-text'
    },

    {
        title: 'Support',
        path: '/support',
        icon: <Io_Icons.IoMdHelpCircle />,
        cName: 'nav-text'
    },
]