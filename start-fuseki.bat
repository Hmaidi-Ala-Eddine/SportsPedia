@echo off
echo Starting Fuseki...
cd ".\fuseki-server\apache-jena-fuseki-5.6.0"
java -Xmx4G -jar fuseki-server.jar --config=run\configuration\sportspedia.ttl
