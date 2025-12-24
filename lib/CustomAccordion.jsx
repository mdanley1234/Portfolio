import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function CustomAccordion({ headers, contents, dates, defaultExpanded = null }) {
  return (
    <div style={{ 
      border: '1px solid #ffffff', 
      borderRadius: '8px',
      overflow: 'hidden'
    }}>
      {headers.map((header, index) => (
        <div key={index}>
          <Accordion 
            defaultExpanded={defaultExpanded === index}
            sx={{
              backgroundColor: '#000000',
              color: '#ffffff',
              boxShadow: 'none',
              '&:before': {
                display: 'none',
              },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ color: '#ffffff' }} />}
              aria-controls={`panel${index}-content`}
              id={`panel${index}-header`}
              sx={{
                backgroundColor: '#000000',
                color: '#ffffff',
                minHeight: '64px',
                '&.Mui-expanded': {
                  minHeight: '64px',
                },
                '& .MuiAccordionSummary-content': {
                  margin: '12px 0',
                },
                '& .MuiAccordionSummary-content.Mui-expanded': {
                  margin: '12px 0',
                },
              }}
            >
              <div>
                <Typography component="span" sx={{ 
                  color: '#ffffff',
                  fontSize: '18px',
                  fontWeight: 600,
                  display: 'block'
                }}>
                  {header}
                </Typography>
                {dates && dates[index] && (
                  <Typography sx={{ 
                    color: '#9ca3af', 
                    fontSize: '12px',
                    fontWeight: 400,
                    marginTop: '4px'
                  }}>
                    {dates[index]}
                  </Typography>
                )}
              </div>
            </AccordionSummary>
            <AccordionDetails
              sx={{
                backgroundColor: '#000000',
                color: '#ffffff',
                paddingTop: '8px',
                paddingBottom: '16px',
              }}
            >
              <Typography sx={{ color: '#ffffff' }}>
                {contents[index]}
              </Typography>
            </AccordionDetails>
          </Accordion>
          {index < headers.length - 1 && (
            <div style={{
              height: '1px',
              backgroundColor: '#ffffff',
              marginLeft: '16px',
              marginRight: '16px',
            }} />
          )}
        </div>
      ))}
    </div>
  );
}