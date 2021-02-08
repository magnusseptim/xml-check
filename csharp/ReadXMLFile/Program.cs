using System;
using System.Linq;
using System.Xml.Linq;

namespace ReadXMLFile
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.ForegroundColor = ConsoleColor.White;
            Console.WriteLine("Script start here");
            Console.WriteLine();

            Console.WriteLine("Put file localization here :");
            var fileLocalization = Console.ReadLine();
            Console.WriteLine();


            var file = new System.IO.StreamReader(fileLocalization);
            XDocument doc = XDocument.Load(file);

            Console.WriteLine("file loaded correctly");
            Console.WriteLine();

            Console.WriteLine("Put parent node name here :");
            var parentNodeName = Console.ReadLine();
            Console.WriteLine();

            Console.WriteLine("Put parent node attribute to check here :");
            var parentNodeAttrName = Console.ReadLine();
            Console.WriteLine();

            Console.WriteLine("Put child node name:");
            var childNodeName = Console.ReadLine();
            Console.WriteLine();

            Console.WriteLine("Put child node attribute name:");
            var childNodeAttrName = Console.ReadLine();
            Console.WriteLine();

            var result = (from ele in doc.Descendants(parentNodeName)
                          select ele).ToList();

            foreach (var t in result)
            {
                var attrVal = t.Attributes(parentNodeAttrName).FirstOrDefault().Value;

                foreach(var y in t.Descendants(childNodeName))
                {
                    if (y.Attributes(childNodeAttrName).Any())
                    {
                        var attributes = y.Attributes(childNodeAttrName);
                        foreach (var attr in attributes)
                        {
                            if (attr.Value != attrVal)
                            {
                                Console.Write($"Wrong attr value");
                                Console.WriteLine();
                                Console.ForegroundColor = ConsoleColor.Red;
                                Console.Write($"{y}");
                                Console.WriteLine();
                                Console.ForegroundColor = ConsoleColor.White;
                            }
                        }
                    }
                }
            }

            Console.WriteLine("We are done here");
        }
    }
}
