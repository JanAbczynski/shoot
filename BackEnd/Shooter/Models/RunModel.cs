using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Comander.Models
{
    public class RunModel
    {
        [Key]
        public string Id { get; set; }
        public string competitionId { get; set; }
        public string ownerId { get; set; }
        public string description { get; set; }
        public string target { get; set; }
        public int noOfShots { get; set; }
        
    }
}
