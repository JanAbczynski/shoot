using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Comander.Models
{
    public class TargetModel
    {
        public string Id { get; set; }
        public string targetName { get; set; }
        public int sizeX { get; set; }
        public int sizeY { get; set; }
        public int noOfFields { get; set; }
        public string url { get; set; }
        public string creator { get; set; }
        public string pointsPerShot { get; set; }
        public PointPerShot[] pointPerShotOBJ {get; set;}

    }

    public class PointPerShot
    {
        public string fieldId { get; set; }
        public int pointPerShot { get; set; }
        public bool specialPoint { get; set; }
        public string creatorID { get; set; }
    }
}
