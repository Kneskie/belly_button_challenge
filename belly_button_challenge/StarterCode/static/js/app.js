//Place url in a constant variable
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

//Fetch the json data and console log it
d3.json(url).then(function(data) {
    console.log(data);
});

//Initialize the dashboard
function init() {

    //Use d3 to select the dropdown menu
    let dropdownMenu = d3.select("#selDataset");

    //use d3 to get sample names and populate the drop-down
    d3.json(url).then((data) => {
        
        //variable for sample names
        let names = data.names;

        //add to dropdown
        names.forEach((id) => {

            //log value of id for each iteration
            console.log(id);

            dropdownMenu.append("option").text(id).property("value", id);

        });

        //set the first sample from the list
        let sampleOne = names[0];
        console.log(sampleOne);

        //Build initial plots
        buildMetadata(sampleOne);
        buildBarChart(sampleOne);
        buildBubbleChart(sampleOne);        
    });
};

//Function that populates metadata info
function buildMetadata(sample) {

    //Retrieve data w/d3
    d3.json(url).then((data) => {

        //Retrieve metaData
        let metadata = data.metadata;

        //filter based on value of sample
        let value = metadata.filter(result => result.id == sample);

        //Log 
        console.log(value);

        //get first index from the array
        let valueData = value[0];

        //Clear metadata
        d3.select("#sample=metadata").html("");

        //use Object.entries to add each key/value pair to the panel
        Object.entries(valueData).forEach(([key, value]) => {
            console.log(key, value);
            d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
        });
    });
};

//Function that builds the bar chart
function buildBarChart(sample) {

    //retrieve with d3
    d3.json(url).then((data) => {

        //retrieve sample data
        let sampleInfo = data.samples;

        //Filter based on value
        let value = sampleInfo.filter(result => result.id == smaple);

        //Get first index from array
        let valueData = value[0];

        //Get otu_ids, labels, and sample values
        let otu_ids = valueData.otu_ids;
        let otu_labels = valueData.otu_labels;
        let sample_values = valueData.sample_values;

        //log
        console.log(otu_ids, otu_labels, sample_values);

        //set top ten items in descending order
        let yticks = otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();
        let xticks = sample_values.slice(0,10).reverse();
        let labels = otu_labels.slice(0,10).reverse();

        //Trace for bar chart
        let trace = {
            x: xticks,
            y: yticks,
            text: labels,
            type: "bar",
            orientation: "h"
        };

        //Set the layout
        let layout = {
            title: "Top 10 OTUs Present"
        };

        //call Plotly to plot the bar chart
        Plotly.newPlot("bar", [trace], layout)
    });
};
//Bubble Chart Function
function buildBubbleChart(sample) {
    //d3 retrieval
    d3.json(url).then((data) => {

        //Retrieve sample data
        let sampleInfo = data.samples;

        //Filter based on value
        let value = sampleInfo.filter(result => result.id ==sample);

        //get first index
        let valueData = value[0];

        //Get the otu_ids, labels and sample values
        let otu_ids = valueData.otu_ids;
        let otu_labels = valueData.otu_labels;
        let sample_values = valueData.sample_values;

        //Log 
        console.log(otu_ids, otu_labels, sample_values);

        //Set up trace
        let trace1 = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
            }
        };

        //Set the Layout
        let layout = {
            title: "Bacteria Per Sample",
            hovermode: "closest",
            xaxis: {title:"OTU ID"},
        };

        //Call Ploty for bubble
        Plotly.newPlot("bubble", [trace1], layout)
    });
};

//Function that updates dashboard when sample is changed
function optionUpdated(value) {

    //log new value
    console.log(value);

    //Call all functions 
    buildBarChart(value);
    buildBubbleChart(value);
    buildMetadata(value);
};

//Call the initialize function
init();