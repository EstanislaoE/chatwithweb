import React from "react";
import { Card, CardContent, CardFooter } from "./ui/card";
import Markdown from "./markdown";

type Props = {
  role: string;
  content: string;
};

const MessageBox = ({ role, content }: Props) => {
  return (
    <Card>
      <CardContent className="p-6 text-sm">
        <Markdown content={content} />
      </CardContent>
      {role !== "user" && (
        <CardFooter className="border-t bg-muted/70 px-6 py-3 text-xs text-muted-foreground">
          Disclamer: Answers provided by chat-bot should be consulted with a
          professional!
        </CardFooter>
      )}
    </Card>
  );
};

export default MessageBox;
