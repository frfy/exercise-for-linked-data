/**
* Create a JSON-LD representation of the person data below using the FOAF Vocabulary.
* auther : Congfeng Cao
*/

//import rdflib
const $rdf = require('rdflib');
const jsonld = require('jsonld');
const fs = require("fs")

// use namespace
const RDF = $rdf.Namespace("http://www.w3.org/1999/02/22-rdf-syntax-ns#");
const FOAF = $rdf.Namespace("http://xmlns.com/foaf/0.1/");
const XSD = $rdf.Namespace('http://www.w3.org/2001/XMLSchema#');

// creat a graph
const graph  = $rdf.graph();
const gwen = graph.sym('https://new-u.tech/gwen/#me');

//creat a person
graph.add(gwen, RDF('type'), FOAF('Person'))
graph.add(gwen, FOAF('firstName'),'Gwendolyne')
graph.add(gwen, FOAF('familyName'),'Stacy')
graph.add(gwen, FOAF('nick'),'Gwen')
graph.add(gwen, FOAF('mbox'),$rdf.lit('gwen@new-u.tech', XSD('anyURI')))
graph.add(gwen, FOAF('homepage'),$rdf.lit('https://new-u.tech/gwen', XSD('anyURI')))
graph.add(gwen, FOAF('img'),$rdf.lit('https://static.wikia.nocookie.net/marveldatabase/images/e/e7/Symbiote_Spider-Man_Vol_1_1_Artgerm_Virgin_Variant.jpg/revision/latest/scale-to-width-down/856?cb=20190125221031', XSD('anyURI')))

//creat an organization
const org = graph.sym('https://new-u.tech')
graph.add(org, RDF('type'),FOAF('Organization'))
graph.add(org, FOAF('name'), 'New U Technologies')
graph.add(org, FOAF('page'), $rdf.lit('https://new-u.tech', XSD('anyURI')))

//organization-[member]-person
graph.add(org, FOAF('member') , gwen)

//jsonld serialization
$rdf.serialize(null, graph, gwen.uri, 'application/ld+json', (err, jsonldData) => {
    jsonldtoRDF(jsonldData)

    fs.writeFile('./data/jsonldData.txt', jsonldData,  function(err) {
        if (err) {
            return console.error(err);
        }
        console.log("Storage success!");
     });
});

//format Jsonld to RDF and get organisation infromation
async function jsonldtoRDF(result){

    console.log('Jsonld result:\n', result)
    jsonldresult = JSON.parse(result)
    const nquads = await jsonld.toRDF(jsonldresult, {format: 'application/n-quads'});
    console.log('After formatting - N-quads:\n',nquads)

    // getting organisation information
    // ID
    const frame_id={
        '@id': 'https://new-u.tech',
      }

    //type
    const frame={
        '@type': 'http://xmlns.com/foaf/0.1/Organization',
    }
    
    const framed = await jsonld.frame(jsonldresult, frame_id);
    console.log('Organisation information:')
    console.log(framed)
}

console.log('Good Job! Task completed')