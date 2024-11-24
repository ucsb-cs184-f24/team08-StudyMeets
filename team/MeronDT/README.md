# HW 04 
**Part A:**
First 6 images display app before part B changes were implemented. These images are from the 'main' branch.

**Part B:**
Next 3 images display app after changes: The first image shows the filter button on the explore page, the second and third images show the tags within the filter submenu. These images are from the 'mt-classes' branch.

Added A new filter button on the explore page next to the search bar. Users can click on this button and a list of tags pops up for the user to filter through groups with. Under the standard tags are two other subheadings of Subjects and Classes. The tags populating these lists are pulled from the UCSB gold database using the schools academic API. At the bottom of the menu are buttons to apply or reset filters, and once filters are applied groups will be filtered on the explore page until tags are reset.

The Implementation for the filtering was written within the Explore.js file (https://github.com/ucsb-cs184-f24/team08-StudyMeets/blob/mt-classes/StudyMeets/app/screens/Explore.js).

UCSB Academic Curriculums API (https://developer.ucsb.edu/content/academic-curriculums#/Classes/Classes_GetClassesAsync)
