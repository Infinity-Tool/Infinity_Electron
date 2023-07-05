import React, { useMemo } from "react";
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineSeparator,
  timelineItemClasses,
} from "@mui/lab";
import { Paper } from "@mui/material";
import { AppRoutes, RoutesMeta } from "Services/Constants";
import { useLocation } from "react-router";
import { useTheme } from "@emotion/react";
import { toHtml } from "@fortawesome/fontawesome-svg-core";

export default function InstallTimeline() {
  const location = useLocation();
  const routesArray = Object.values(AppRoutes);
  const theme = useTheme();

  const currentRouteMeta = useMemo(
    () => RoutesMeta[(location.pathname ?? AppRoutes.welcome) as AppRoutes],
    [location.pathname]
  );

  //Functions
  const GetTimelineDot = (index: number): any => {
    if (index === currentRouteMeta.value) {
      return { color: "primary", variant: "outlined" };
    } else if (index < currentRouteMeta.value) {
      return { color: "primary", variant: "filled" };
    }
    return { color: "grey", variant: "outlined" };
  };

  //Styles
  const timelineContainerStyles = {
    height: "100%",
  };
  const timelineItemStyles = {
    [`& .${timelineItemClasses.root}:before`]: {
      flex: 0,
      padding: 0,
    },
  };
  const connectorStyles = {
    opacity: 0.3,
  };
  const timelineContentStyles = { color: "text.secondary" };

  return (
    <Paper sx={timelineContainerStyles}>
      <Timeline sx={timelineItemStyles}>
        {
          //loop over all Routes enum
          routesArray.map((route, i) => (
            <TimelineItem>
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

      {/* <Timeline sx={timelineItemStyles}>
        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>Welcome</TimelineContent>
        </TimelineItem>

        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>Agreement</TimelineContent>
        </TimelineItem>

        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>Configuration</TimelineContent>
        </TimelineItem>

        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>Selection</TimelineContent>
        </TimelineItem>

        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>Download & Install</TimelineContent>
        </TimelineItem>

        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot />
          </TimelineSeparator>
          <TimelineContent>Finish</TimelineContent>
        </TimelineItem>
      </Timeline> */}
    </Paper>
  );
}
