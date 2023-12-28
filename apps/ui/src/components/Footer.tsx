import { BottomNavigation, IconButton, Tooltip } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

function Footer({ position = 'fixed' }) {
  return (
    <BottomNavigation
      sx={{ position: { position }, bottom: 0, left: 0, right: 0 }}
    >
      <Tooltip title="GitHub Repository">
        <IconButton
          component={'a'}
          href="https://github.com/ckng0221/library-app"
          target="_blank"
        >
          <GitHubIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Author's Linkedlin">
        <IconButton
          component={'a'}
          href="https://www.linkedin.com/in/choon-khon-ng-7b5755149/"
          target="_blank"
        >
          <LinkedInIcon />
        </IconButton>
      </Tooltip>
    </BottomNavigation>
  );
}

export default Footer;
