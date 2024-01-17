import React, { useMemo } from 'react';
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineSeparator,
  timelineItemClasses,
} from '@mui/lab';
import { Paper } from '@mui/material';
// import { useLocation } from 'react-router';
import { AppRoutes, RoutesMeta, installFlow } from '../Services/Constants';
import { useLocation } from 'react-router-dom';
import { useSelectionContext } from '../Services/SelectionContext';

export default function InstallTimeline() {
  const location = useLocation();
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
  const timelineContainerStyles = {};
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
    </Paper>
  );
}
