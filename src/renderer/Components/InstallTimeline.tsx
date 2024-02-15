import { useMemo } from 'react';
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineSeparator,
  timelineItemClasses,
} from '@mui/lab';
import { Box, Paper, useTheme } from '@mui/material';
import { AppRoutes, RoutesMeta, installFlow } from '../Services/Constants';
import { useLocation } from 'react-router-dom';
import { useSelectionContext } from '../Services/SelectionContext';
import ThemeToggler from './ThemeToggler';
import AppVersionLabel from './AppVersionLabel';

export default function InstallTimeline() {
  const location = useLocation();
  const theme = useTheme();
  const { moddedInstall } = useSelectionContext();
  const routesArray = Object.values(AppRoutes)
    .filter((r) => r !== AppRoutes.canceled)
    .filter((r) => {
      const routeMeta = RoutesMeta[r];

      return moddedInstall
        ? routeMeta.installFlow !== installFlow.vanilla
        : routeMeta.installFlow !== installFlow.modded;
    });

  const currentRouteMeta = useMemo(
    () => RoutesMeta[(location.pathname ?? AppRoutes.welcome) as AppRoutes],
    [location.pathname],
  );

  //Functions
  const GetTimelineDot = (index: number): any => {
    if (index === currentRouteMeta.value) {
      return { color: 'primary', variant: 'outlined' };
    } else if (index < currentRouteMeta.value) {
      return { color: 'primary', variant: 'filled' };
    }
    return { color: 'grey', variant: 'outlined' };
  };

  //Styles
  const timelineContainerStyles = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'space-between',
  };
  const timelineItemStyles = {
    width: '220px',

    [`& .${timelineItemClasses.root}:before`]: {
      flex: 0,
      padding: 0,
    },
  };
  const connectorStyles = {
    opacity: 0.3,
  };
  const timelineContentStyles = {
    color: 'text.secondary',
    textWrap: 'nowrap',
  };

  const bottomRowStyles = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    p: theme.spacing(2),
  };

  return (
    <Paper sx={timelineContainerStyles}>
      <Timeline sx={timelineItemStyles}>
        {
          //loop over all Routes enum
          routesArray.map((route, i) => (
            <TimelineItem key={i}>
              <TimelineSeparator>
                <TimelineDot
                  color={GetTimelineDot(i).color}
                  variant={GetTimelineDot(i).variant}
                />
                {i < routesArray.length - 1 && (
                  <TimelineConnector sx={connectorStyles} />
                )}
              </TimelineSeparator>
              <TimelineContent sx={timelineContentStyles}>
                {RoutesMeta[route].title}
              </TimelineContent>
            </TimelineItem>
          ))
        }
      </Timeline>
      <Box sx={bottomRowStyles}>
        <ThemeToggler />
        <AppVersionLabel />
      </Box>
    </Paper>
  );
}
