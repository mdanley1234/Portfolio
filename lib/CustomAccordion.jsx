import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

/**
 * 
 * @param experiences List of Experience objects used to generate expanding components
 * @returns 
 */
export default function CustomAccordion({ experiences }) {

  // Build the accordion component
  return (
    <div style={{
      border: '1px solid #ffffff',
      borderRadius: '8px',
      overflow: 'hidden',
    }}
    >

      {/* Build expanding component for each experience */}
      {experiences.map((experience, index) => (
        <div key={index}>
          <Accordion
            sx={{
              backgroundColor: '#000000',
              color: '#ffffff',
              boxShadow: 'none',
              '&:before': {
                display: 'none',
              },
            }}
          >

            {/* Summary Section */}
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

              {/* Left side - Company and Position */}
              <div className="flex flex-col gap-1">
                {/* Company Header Section */}
                <Typography component="span" sx={{
                  color: '#ffffff',
                  fontSize: '20px',
                  fontWeight: 600,
                  lineHeight: 1.2
                }}>
                  {experience.company}
                </Typography>
                {/* Position on its own line */}
                <Typography sx={{
                  color: '#ffffff',
                  fontSize: '16px',
                  fontWeight: 500
                }}>
                  {experience.position}
                </Typography>
                {/* Dates on separate line */}
                <Typography sx={{
                  color: '#a4aab5ff',
                  fontSize: '14px',
                  fontWeight: 400
                }}>
                  {experience.start} - {experience.end}
                </Typography>
              </div>

            </AccordionSummary>

            {/* Details Section */}
            <AccordionDetails
              sx={{
                backgroundColor: '#000000',
                color: '#ffffff',
                paddingTop: '8px',
                paddingBottom: '16px',
              }}
            >

              {experience.content}

            </AccordionDetails>
          </Accordion>
          {index < experiences.length - 1 && (
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