import { FC } from "react";

import { Box, styled } from "@mui/material";

import { BaseSkeleton } from "~/layout/Loading";
import { useAppSelector } from "~/store/hooks";
import { selectBoardColumnWidth } from "~/store/settingsSlice";

import { TaskCreateForm } from "../../TaskCreateForm";
import { BoardWrapper } from "./BoardWrapper";

export const LoadingBoard: FC = () => (
  <>
    <TaskCreateForm loading={true} />

    <BoardWrapper>
      <ColumnsContainer>
        <ColumnSkeleton height="50vh" />
        <ColumnSkeleton height="25vh" />
        <ColumnSkeleton height="37vh" />
        <ColumnSkeleton height="42vh" />
        <ColumnSkeleton height="30vh" />
      </ColumnsContainer>
    </BoardWrapper>
  </>
);

const ColumnsContainer = styled(Box)({
  display: "flex",
  justifyContent: "center",
  flexWrap: "wrap",
  maxHeight: "50vh",
  overflow: "hidden",
});

const ColumnSkeleton: FC<{ height: string }> = (props) => {
  const columnWidth = useAppSelector(selectBoardColumnWidth);

  return (
    <BaseSkeleton
      width={`${columnWidth}px`}
      height={props.height}
      variant="rectangular"
      animation="wave"
      sx={{ marginInline: "0.5rem" }}
    />
  );
};
