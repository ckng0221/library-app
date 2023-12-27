import { Button, IconButton, Snackbar, Tooltip } from '@mui/material';
import { useState } from 'react';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

interface IProps {
  text: string | undefined;
}

const CopyToClipboardIcon = (props: IProps) => {
  const [open, setOpen] = useState(false);

  const handleCopyToClipboard = (text: string | undefined) => {
    if (!text) return;
    setOpen(true);
    navigator.clipboard.writeText(text);
  };

  return (
    <>
      {/* <Tooltip title="Copy to clipboard"> */}
      <IconButton
        aria-label="Copy to clipboard"
        size="small"
        onClick={() => handleCopyToClipboard(props.text)}
      >
        <ContentCopyIcon fontSize="inherit" />
      </IconButton>
      {/* </Tooltip> */}
      <Snackbar
        open={open}
        onClose={() => setOpen(false)}
        autoHideDuration={2000}
        message="Copied to clipboard"
      />
    </>
  );
};

export default CopyToClipboardIcon;
